"""Exercise the actual workflow selectors with local gh/bash fixtures only."""
import copy
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

import yaml

HELPER = Path(__file__).resolve().parent
WORKFLOW = HELPER / 'daily-ai-maintenance.yml'
if not WORKFLOW.exists():
    WORKFLOW = HELPER.parent / 'workflows' / 'daily-ai-maintenance.yml'


class DependencySelectionTests(unittest.TestCase):
    def fixture(self, number=1, author='app/renovate', conclusion='SUCCESS'):
        return {'number': number, 'author': {'login': author}, 'title': 'chore(deps): update patch',
                'isDraft': False, 'mergeable': 'MERGEABLE', 'reviewDecision': 'APPROVED',
                'statusCheckRollup': [{'status': 'COMPLETED', 'conclusion': conclusion}], 'labels': []}

    def selected(self, mode, prs):
        name = {'merge': 'Merge fully green low-risk dependency PRs',
                'repair': 'Repair up to three failing dependency PRs'}[mode]
        workflow = yaml.safe_load(WORKFLOW.read_text())
        script = next(step['run'] for step in workflow['jobs']['maintain']['steps'] if step.get('name') == name)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'fixtures.json').write_text(json.dumps(prs))
            (root / 'selected').write_text('')
            stubs = {
                'gh': 'case "$1 $2" in\n "pr list") cat "$FIXTURES";;\n "pr merge") echo "$3" >> "$SELECTED";;\n *) exit 9;;\nesac\n',
                'bash': '[[ "$2" == dependency ]] || exit 9\necho "$3" >> "$SELECTED"\n',
            }
            for name, body in stubs.items():
                path = root / name
                path.write_text('#!/bin/bash\nset -euo pipefail\n' + body)
                path.chmod(0o755)
            environment = dict(os.environ, PATH=f'{root}:{os.environ["PATH"]}',
                               MAINTENANCE_HELPER=str(HELPER), RUNNER_TEMP=str(root),
                               GITHUB_STEP_SUMMARY=str(root / 'summary'),
                               OPENAI_API_KEY='fixture-not-a-key', FIXTURES=str(root / 'fixtures.json'),
                               SELECTED=str(root / 'selected'))
            # Isolate the existing merge step's fixed temp filename between tests.
            script = script.replace('/tmp/prs.json', '"$RUNNER_TEMP/prs.json"')
            result = subprocess.run(['/bin/bash', '-c', script], cwd=root, env=environment,
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            return [int(n) for n in (root / 'selected').read_text().splitlines()]

    def test_exact_cli_and_canonical_bot_identities_in_both_paths(self):
        for author in ['app/renovate', 'app/dependabot', 'renovate[bot]', 'dependabot[bot]']:
            for mode, conclusion in [('merge', 'SUCCESS'), ('repair', 'FAILURE')]:
                with self.subTest(author=author, mode=mode):
                    self.assertEqual(self.selected(mode, [self.fixture(author=author, conclusion=conclusion)]), [1])

    def test_bare_names_lookalikes_and_nonbots_rejected(self):
        for mode, conclusion in [('merge', 'SUCCESS'), ('repair', 'FAILURE')]:
            prs = [self.fixture(n, author, conclusion) for n, author in enumerate(
                ['renovate', 'dependabot', 'app/renovate-extra', 'user/renovate', 'Renovate[bot]', '', None], 1)]
            nonbot = self.fixture(90, 'app/renovate', conclusion)
            nonbot['author']['is_bot'] = False
            prs.extend([nonbot, dict(self.fixture(91, conclusion=conclusion), author=None)])
            self.assertEqual(self.selected(mode, prs), [])

    def test_merge_review_and_health_guards_preserved(self):
        prs = [self.fixture()]
        overrides = [{'isDraft': True}, {'mergeable': 'CONFLICTING'}, {'statusCheckRollup': []},
                     {'reviewDecision': 'CHANGES_REQUESTED'}, {'reviewDecision': 'REVIEW_REQUIRED'},
                     {'labels': [{'name': 'ai:review-required'}]}, {'title': 'major dependency update'},
                     {'statusCheckRollup': [{'status': 'COMPLETED', 'conclusion': 'FAILURE'}]},
                     {'statusCheckRollup': [{'status': 'IN_PROGRESS', 'conclusion': None}]}]
        for number, override in enumerate(overrides, 2):
            prs.append(dict(self.fixture(number), **copy.deepcopy(override)))
        self.assertEqual(self.selected('merge', prs), [1])

    def test_repair_requires_failure_nondraft_and_caps_at_three(self):
        prs = [self.fixture(n, conclusion='FAILURE') for n in [8, 4, 6, 2]]
        prs.extend([dict(self.fixture(1, conclusion='FAILURE'), isDraft=True), self.fixture(3),
                    self.fixture(7, conclusion='TIMED_OUT')])
        self.assertEqual(self.selected('repair', prs), [2, 4, 6])


if __name__ == '__main__':
    unittest.main()
