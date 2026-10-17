import importlib.util
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('maintenance', Path(__file__).with_name('maintenance.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class MaintenanceTests(unittest.TestCase):
    def test_yaml_12_and_scalar_types(self):
        self.assertEqual(m.workflow_data('on: [push]'), m.workflow_data('"on": ["push"]'))
        self.assertNotEqual(m.workflow_data('key: true'), m.workflow_data('key: 1'))
        self.assertNotEqual(m.workflow_data('key: "on"'), m.workflow_data('key: true'))
        with self.assertRaises(RuntimeError):
            m.workflow_data('on: push\non: pull_request')

    def test_yaml_12_integer_resolution(self):
        self.assertNotEqual(m.workflow_data('key: 012'), m.workflow_data('key: 10'))
        self.assertEqual(m.workflow_data('key: 012'), m.workflow_data('key: 12'))
        self.assertEqual(m.workflow_data('key: 0o14'), m.workflow_data('key: 12'))
        self.assertEqual(m.workflow_data('key: 0xC'), m.workflow_data('key: 12'))
        self.assertEqual(m.workflow_data('key: +012'), m.workflow_data('key: 12'))

    def test_yaml_12_legacy_scalars_are_strings(self):
        for value in ['1:20', '2001-12-15', '2001-12-15T02:59:43.1Z', '0b11', '1_000']:
            with self.subTest(value=value):
                self.assertEqual(m.workflow_data(f'key: {value}'), m.workflow_data(f'key: "{value}"'))
        self.assertNotEqual(m.workflow_data('key: 1:20'), m.workflow_data('key: 80'))

    def test_yaml_float_types_and_precision_preserved(self):
        self.assertNotEqual(m.workflow_data('key: 1e3'), m.workflow_data('key: "1e3"'))
        self.assertNotEqual(m.workflow_data('key: 9007199254740992.0'),
                            m.workflow_data('key: 9007199254740993.0'))
        with self.assertRaises(RuntimeError):
            m.workflow_data('key: !!int 1:20')

    def test_package_commands_do_not_receive_secrets(self):
        secrets = {'GH_TOKEN': 'dummy-gh', 'GITHUB_TOKEN': 'dummy-github', 'OPENAI_API_KEY': 'dummy-provider'}
        with patch.dict(os.environ, secrets), patch.object(m.subprocess, 'run') as command:
            command.return_value.stdout = ''
            for binary in ['npm', 'node_modules/.bin/prettier']:
                m.run(binary, '--version')
                self.assertFalse(set(secrets) & set(command.call_args.kwargs['env']))

    def test_agent_receives_only_required_provider_secret(self):
        secrets = {'GH_TOKEN': 'dummy-gh', 'GITHUB_TOKEN': 'dummy-github', 'OPENAI_API_KEY': 'dummy-provider'}
        script = 'import os; assert "GH_TOKEN" not in os.environ; assert "GITHUB_TOKEN" not in os.environ; assert os.environ["OPENAI_API_KEY"] == "dummy-provider"'
        with patch.dict(os.environ, secrets):
            m.checked_agent([sys.executable, '-c', script])

    def test_yaml_run_script_and_expression_preserved(self):
        before = 'on: push\njobs:\n  test:\n    if: ${{ github.ref == \'main\' }}\n    steps:\n      - run: |\n          echo one\n          echo two\n'
        after = before.replace('on: push', '"on": "push"')
        self.assertEqual(m.workflow_data(before), m.workflow_data(after))
        self.assertNotEqual(m.workflow_data(before), m.workflow_data(before.replace('echo two', 'echo three')))

    def test_zero_exit_provider_failure(self):
        for message in ['No credits remaining', 'insufficient_quota', 'litellm.AuthenticationError: invalid key', 'litellm.APIConnectionError: offline', 'litellm.NotFoundError: missing model', 'billing_hard_limit_reached']:
            with self.subTest(message=message), self.assertRaises(RuntimeError):
                m.checked_agent([sys.executable, '-c', f'print({message!r})'])

    def test_nonzero_agent_exit(self):
        with self.assertRaises(RuntimeError):
            m.checked_agent([sys.executable, '-c', 'raise SystemExit(4)'])

    def test_successful_noop(self):
        m.checked_agent([sys.executable, '-c', 'print("No changes needed")'])

    def test_lock_mismatch_is_specific(self):
        self.assertTrue(m.LOCK_MISMATCH.search('npm error Missing: jest@30.2.0 from lock file'))
        self.assertFalse(m.LOCK_MISMATCH.search('npm error EAI_AGAIN registry.npmjs.org'))

    def test_workflow_cannot_be_agent_target(self):
        with patch.object(m, 'tracked', return_value=['.github/workflows/test.yml']), self.assertRaises(RuntimeError):
            m.snapshot('/unused', ['.github/workflows/test.yml'])

    def test_lockfile_cannot_be_agent_target(self):
        with patch.object(m, 'tracked', return_value=['package-lock.json']), self.assertRaises(RuntimeError):
            m.snapshot('/unused', ['package-lock.json'])


class RepositoryTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.previous = Path.cwd()
        self.root = Path(self.temporary.name) / 'repo'
        self.root.mkdir()
        os.chdir(self.root)
        self.snapshot = Path(self.temporary.name) / 'snapshot.json'
        self.git('init', '-q')
        self.git('config', 'user.name', 'Maintenance Test')
        self.git('config', 'user.email', 'test@example.invalid')
        self.write('src/index.ts', 'export const value = 1\n')
        self.write('README.md', 'Readme\n')
        self.write('package.json', '{"name":"fixture","version":"1.0.0"}\n')
        self.write('package-lock.json', '{"name":"fixture","lockfileVersion":3}\n')
        self.write('.github/workflows/test.yml', 'on: push\njobs: {}\n')
        self.write('.gitignore', 'node_modules/\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'Fixture')

    def tearDown(self):
        os.chdir(self.previous)
        self.temporary.cleanup()

    def git(self, *args):
        return subprocess.run(['git', *args], check=True, text=True, capture_output=True).stdout

    def write(self, path, text):
        file = Path(path)
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(text)

    def test_source_target_can_change(self):
        m.snapshot(self.snapshot, ['src/index.ts'])
        self.write('src/index.ts', 'export const value = 2\n')
        m.verify_snapshot(self.snapshot)

    def test_protected_workflow_change_is_rejected(self):
        m.snapshot(self.snapshot, ['src/index.ts'])
        self.write('.github/workflows/test.yml', 'on: pull_request\njobs: {}\n')
        with self.assertRaises(RuntimeError):
            m.verify_snapshot(self.snapshot)

    def test_staged_only_protected_change_is_rejected(self):
        path = '.github/workflows/test.yml'
        original = Path(path).read_text()
        m.snapshot(self.snapshot, ['src/index.ts'])
        self.write(path, 'on: pull_request\njobs: {}\n')
        self.git('add', path)
        self.write(path, original)
        self.assertIn(path, m.changes())
        with self.assertRaisesRegex(RuntimeError, 'Git index'):
            m.verify_snapshot(self.snapshot)

    def test_agent_commit_is_rejected(self):
        m.snapshot(self.snapshot, ['src/index.ts'])
        self.write('src/index.ts', 'export const value = 2\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'Unexpected commit')
        with self.assertRaisesRegex(RuntimeError, 'Git HEAD'):
            m.verify_snapshot(self.snapshot)

    def test_file_mode_change_is_rejected(self):
        m.snapshot(self.snapshot, ['src/index.ts'])
        Path('src/index.ts').chmod(0o755)
        with self.assertRaisesRegex(RuntimeError, 'file mode'):
            m.verify_snapshot(self.snapshot)

    def test_target_symlink_is_rejected(self):
        m.snapshot(self.snapshot, ['src/index.ts'])
        Path('src/index.ts').unlink()
        Path('src/index.ts').symlink_to('../README.md')
        with self.assertRaises(RuntimeError):
            m.verify_snapshot(self.snapshot)

    def test_validation_cannot_change_generated_lock(self):
        self.write('package-lock.json', '{"name":"fixture","lockfileVersion":3,"packages":{}}\n')
        m.snapshot(self.snapshot, [])
        self.write('package-lock.json', '{"malicious":"post-validation mutation"}\n')
        with self.assertRaises(RuntimeError):
            m.verify_snapshot(self.snapshot)

    def test_validation_cannot_change_allowed_source(self):
        self.write('src/index.ts', 'export const value = 2\n')
        m.snapshot(self.snapshot, [])
        self.write('src/index.ts', 'export const value = 3\n')
        with self.assertRaises(RuntimeError):
            m.verify_snapshot(self.snapshot)

    def test_generated_workflow_semantics_and_deletion_rejected(self):
        self.write('.github/workflows/test.yml', 'on: pull_request\njobs: {}\n')
        with self.assertRaises(RuntimeError):
            m.verify_generated()
        Path('.github/workflows/test.yml').unlink()
        with self.assertRaises(RuntimeError):
            m.verify_generated()

    def test_generated_formatting_accepted(self):
        self.write('.github/workflows/test.yml', '"on": "push"\njobs: { }\n')
        m.verify_generated()

    def test_new_workflow_rejected(self):
        self.write('.github/workflows/new.yml', 'on: push\n')
        with self.assertRaises(RuntimeError):
            m.verify_generated()

    def cws_outputs(self):
        self.write('package.json', '{"name":"client-web-storage","version":"1.0.0"}\n')
        self.write('dist/client-web-storage.min.js', 'original bundle')
        self.write('dist/client-web-storage.min.js.map', 'original map')
        self.git('add', '.')
        self.git('commit', '-qm', 'Known tracked build outputs')

    def test_known_preclean_build_outputs_restored(self):
        self.cws_outputs()
        m.validation_snapshot(self.snapshot)
        self.write('dist/client-web-storage.min.js', 'regenerated bundle')
        self.write('dist/client-web-storage.min.js.map', 'regenerated map')
        m.verify_validation(self.snapshot)
        self.assertEqual(Path('dist/client-web-storage.min.js').read_text(), 'original bundle')
        self.assertFalse(m.changes())

    def test_dirty_build_outputs_cannot_be_discarded(self):
        self.cws_outputs()
        self.write('dist/client-web-storage.min.js', 'intentional pending change')
        with self.assertRaises(RuntimeError):
            m.validation_snapshot(self.snapshot)

    def test_build_source_mutation_is_not_silently_restored(self):
        self.cws_outputs()
        m.validation_snapshot(self.snapshot)
        self.write('dist/client-web-storage.min.js', 'regenerated bundle')
        self.write('src/index.ts', 'changed by build')
        with self.assertRaises(RuntimeError):
            m.verify_validation(self.snapshot)
        self.assertEqual(Path('src/index.ts').read_text(), 'changed by build')
        self.assertEqual(Path('dist/client-web-storage.min.js').read_text(), 'regenerated bundle')

    def test_unrecognized_build_outputs_not_restored(self):
        self.write('dist/unrecognized.js', 'tracked non-output file')
        self.git('add', '.')
        self.git('commit', '-qm', 'Other tracked dist file')
        m.validation_snapshot(self.snapshot)
        self.write('dist/unrecognized.js', 'changed')
        with self.assertRaises(RuntimeError):
            m.verify_validation(self.snapshot)

    def test_non_sync_npm_failure_does_not_regenerate(self):
        real_run = subprocess.run
        calls = []
        def mocked_run(args, **kwargs):
            if args[0] == 'npm':
                self.assertFalse({'GH_TOKEN', 'GITHUB_TOKEN', 'OPENAI_API_KEY'} & set(kwargs['env']))
                calls.append(args)
                return subprocess.CompletedProcess(args, 1, stdout='npm error EAI_AGAIN network unavailable')
            return real_run(args, **kwargs)
        with patch.object(m.subprocess, 'run', side_effect=mocked_run), self.assertRaises(RuntimeError):
            m.generated_repairs()
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0][1], 'ci')
        self.assertFalse(m.changes())

    def test_synced_npm_lock_does_not_regenerate(self):
        real_run = subprocess.run
        calls = []
        def mocked_run(args, **kwargs):
            if args[0] == 'npm':
                self.assertFalse({'GH_TOKEN', 'GITHUB_TOKEN', 'OPENAI_API_KEY'} & set(kwargs['env']))
                calls.append(args)
                return subprocess.CompletedProcess(args, 0, stdout='Installed')
            return real_run(args, **kwargs)
        with patch.object(m.subprocess, 'run', side_effect=mocked_run):
            m.generated_repairs()
        self.assertEqual([args[1] for args in calls], ['ci'])

    def test_formatter_cannot_change_semantics_or_lock(self):
        self.write('node_modules/.bin/prettier', 'stub')
        real_run = subprocess.run
        for changed_path, changed_text in [
            ('.github/workflows/test.yml', 'on: pull_request\njobs: {}\n'),
            ('package-lock.json', '{"not":"npm generated"}\n'),
        ]:
            with self.subTest(path=changed_path):
                self.git('restore', '.')
                def mocked_run(args, **kwargs):
                    if args[0] == 'npm':
                        return subprocess.CompletedProcess(args, 0, stdout='Installed')
                    if args[0] == 'node_modules/.bin/prettier':
                        self.write(changed_path, changed_text)
                        return subprocess.CompletedProcess(args, 0, stdout='Formatted')
                    return real_run(args, **kwargs)
                with patch.object(m.subprocess, 'run', side_effect=mocked_run), self.assertRaises(RuntimeError):
                    m.generated_repairs()

    def test_sync_failure_regenerates_then_rechecks(self):
        real_run = subprocess.run
        calls = []
        def mocked_run(args, **kwargs):
            if args[0] == 'npm':
                self.assertFalse({'GH_TOKEN', 'GITHUB_TOKEN', 'OPENAI_API_KEY'} & set(kwargs['env']))
                calls.append(args)
                if len(calls) == 1:
                    return subprocess.CompletedProcess(args, 1, stdout='npm error EUSAGE\nnpm error Missing: jest@30.2.0 from lock file')
                if args[1] == 'install':
                    self.write('package-lock.json', '{"name":"fixture","lockfileVersion":3,"packages":{}}\n')
                return subprocess.CompletedProcess(args, 0, stdout='Installed')
            return real_run(args, **kwargs)
        with patch.object(m.subprocess, 'run', side_effect=mocked_run):
            m.generated_repairs()
        self.assertEqual([args[1] for args in calls], ['ci', 'install', 'ci'])
        self.assertIn('--package-lock-only', calls[1])
        self.assertEqual(m.changes(), {'package-lock.json'})


class ShellFailureTests(unittest.TestCase):
    def test_lint_test_and_build_failures_prevent_publish(self):
        script = Path(__file__).with_name('maintenance.sh').resolve()
        for failing_command in ['run lint', 'test --if-present', 'run build']:
            with self.subTest(command=failing_command), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                binaries = root / 'bin'
                binaries.mkdir()
                log = root / 'commands.log'
                stubs = {
                    'git': 'echo "git $*" >> "$COMMAND_LOG"\nif [[ "$*" == "diff --quiet HEAD" ]]; then exit 1; fi\n',
                    'gh': 'echo "gh $*" >> "$COMMAND_LOG"\n',
                    'python': 'echo "python $*" >> "$COMMAND_LOG"\n',
                    'npm': 'echo "npm $*" >> "$COMMAND_LOG"\nif [[ "$*" == "$FAIL_COMMAND"* ]]; then exit 7; fi\n',
                }
                for name, body in stubs.items():
                    path = binaries / name
                    path.write_text('#!/usr/bin/env bash\n' + body + 'exit 0\n')
                    path.chmod(0o755)
                environment = dict(os.environ, PATH=f'{binaries}:{os.environ["PATH"]}',
                                   MAINTENANCE_HELPER=str(root), DEFAULT_BRANCH='main',
                                   RUNNER_TEMP=str(root), GITHUB_OUTPUT=str(root / 'output'),
                                   GITHUB_STEP_SUMMARY=str(root / 'summary'), GITHUB_RUN_ID='123',
                                   COMMAND_LOG=str(log), FAIL_COMMAND=failing_command)
                result = subprocess.run(['bash', str(script), 'main'], env=environment,
                                        cwd=root, text=True, capture_output=True)
                self.assertEqual(result.returncode, 7, result.stderr)
                commands = log.read_text()
                self.assertNotIn('git commit', commands)
                self.assertNotIn('git push', commands)
                self.assertNotIn('gh pr create', commands)


if __name__ == '__main__':
    unittest.main()
