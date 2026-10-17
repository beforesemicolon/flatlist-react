"""Deterministic maintenance guards; never execute instructions from CI logs."""

import argparse
import json
import hashlib
import copy
import os
from pathlib import Path
import re
import subprocess
import sys

import yaml

PROVIDER_FAILURE = re.compile(
    r"no credits remaining|insufficient[_ ]quota|exceeded your current quota|"
    r"invalid[_ ]api[_ ]key|incorrect api key|authenticationerror|"
    r"permissiondeniederror|(?:litellm\.)?(?:RateLimit|BadRequest|APIConnection|API|NotFound|InternalServer)Error|"
    r"billing[_ ]hard[_ ]limit|credit balance.*too low|"
    r"unable to connect to (?:the )?(?:api|model)|model.*(?:not found|does not exist)",
    re.IGNORECASE,
)
LOCK_MISMATCH = re.compile(
    r"npm ci can only install packages when.*in sync|"
    r"Missing: .+ from lock file|Invalid: lock file", re.DOTALL
)
# Only these known generated artifacts may be restored after a successful build.
VALIDATION_OUTPUTS = {
    'client-web-storage': (
        'dist/client-web-storage.min.js',
        'dist/client-web-storage.min.js.map',
    ),
}
ALLOWED_SOURCE = re.compile(
    r"^(?:src/|test/|tests/|scripts/|package\.json$|tsconfig[^/]*\.json$)"
)


class WorkflowLoader(yaml.SafeLoader):
    # YAML 1.2 core schema, not PyYAML's YAML 1.1 bool/octal/time rules.
    # https://yaml.org/spec/1.2.2/#103-core-schema
    yaml_implicit_resolvers = copy.deepcopy(yaml.SafeLoader.yaml_implicit_resolvers)


CORE_INT = re.compile(r'^(?:[-+]?[0-9]+|0o[0-7]+|0x[0-9a-fA-F]+)$')
CORE_FLOAT = re.compile(
    r'^(?:[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)(?:[eE][-+]?[0-9]+)?|'
    r'[-+]?\.(?:inf|Inf|INF)|\.(?:nan|NaN|NAN))$'
)
for first, resolvers in WorkflowLoader.yaml_implicit_resolvers.items():
    WorkflowLoader.yaml_implicit_resolvers[first] = [
        entry for entry in resolvers
        if entry[0] not in {
            'tag:yaml.org,2002:bool', 'tag:yaml.org,2002:int',
            'tag:yaml.org,2002:float', 'tag:yaml.org,2002:timestamp',
        }
    ]
WorkflowLoader.add_implicit_resolver(
    'tag:yaml.org,2002:bool', re.compile(r'^(?:true|false|True|False|TRUE|FALSE)$'), list('tTfF')
)
WorkflowLoader.add_implicit_resolver('tag:yaml.org,2002:int', CORE_INT, list('-+0123456789'))
WorkflowLoader.add_implicit_resolver('tag:yaml.org,2002:float', CORE_FLOAT, list('-+0123456789.'))


def core_integer(loader, node):
    value = loader.construct_scalar(node)
    if not CORE_INT.fullmatch(value):
        raise RuntimeError(f'Invalid YAML 1.2 integer: {value}')
    return int(value, 0 if value.startswith(('0o', '0x')) else 10)


class CoreFloat(str):
    # Preserve float lexemes conservatively: binary rounding must never make
    # two distinct YAML numeric values look identical to the safety guard.
    pass


def core_float(loader, node):
    value = loader.construct_scalar(node)
    if not CORE_FLOAT.fullmatch(value):
        raise RuntimeError(f'Invalid YAML 1.2 float: {value}')
    return CoreFloat(value)


class WorkflowDumper(yaml.SafeDumper):
    pass


WorkflowLoader.add_constructor('tag:yaml.org,2002:int', core_integer)
WorkflowLoader.add_constructor('tag:yaml.org,2002:float', core_float)
WorkflowDumper.add_representer(
    CoreFloat, lambda dumper, value: dumper.represent_scalar('tag:yaml.org,2002:float', str(value))
)
# Explicit non-core scalar tags are not part of supported workflow formatting.
for tag in ('timestamp', 'binary', 'omap', 'pairs', 'set'):
    WorkflowLoader.add_constructor(f'tag:yaml.org,2002:{tag}', yaml.SafeLoader.construct_undefined)


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in result:
            raise RuntimeError(f'Duplicate YAML key: {key}')
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


WorkflowLoader.add_constructor('tag:yaml.org,2002:map', unique_mapping)


def workflow_data(text):
    # Serialization retains scalar types (True and 1 must not compare equal).
    return yaml.dump(yaml.load(text, Loader=WorkflowLoader), Dumper=WorkflowDumper, sort_keys=True)


def digest(path):
    p = Path(path)
    if p.is_symlink() or any(parent.is_symlink() for parent in p.parents) or not p.is_file():
        raise RuntimeError(f'Expected regular file: {path}')
    return hashlib.sha256(p.read_bytes()).hexdigest()


def child_environment(*, provider=False):
    environment = os.environ.copy()
    for name in ('GH_TOKEN', 'GITHUB_TOKEN') + (() if provider else ('OPENAI_API_KEY',)):
        environment.pop(name, None)
    return environment


def run(*args, capture=False):
    options = {}
    if Path(args[0]).name in ('npm', 'prettier'):
        options['env'] = child_environment()
    return subprocess.run(args, check=True, text=True, capture_output=capture, **options).stdout


def tracked():
    return run('git', 'ls-files', '-z', capture=True).split('\0')[:-1]


def changes():
    # Include staged, unstaged and new files, including names containing spaces.
    return set(run('git', 'diff', '--name-only', '-z', 'HEAD', capture=True).split('\0')[:-1]) | set(
        run('git', 'diff', '--cached', '--name-only', '-z', 'HEAD', capture=True).split('\0')[:-1]
    ) | set(
        run('git', 'ls-files', '--others', '--exclude-standard', '-z', capture=True).split('\0')[:-1]
    )


def content(path):
    p = Path(path)
    if p.is_symlink() or any(parent.is_symlink() for parent in p.parents) or not p.is_file():
        raise RuntimeError(f'Expected regular file: {path}')
    return p.read_text()


def checked_agent(command):
    # aider can report a fatal provider error yet exit zero. Preserve its status
    # and fail closed on known provider failures even if no files were changed.
    with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=child_environment(provider=True)) as process:
        failed = False
        for line in process.stdout:
            print(line, end='', flush=True)
            failed |= bool(PROVIDER_FAILURE.search(line))
        status = process.wait()
    if status or failed:
        raise RuntimeError(f'AI provider/agent failed (exit {status}); no changes will be published')


def generated_repairs():
    if changes():
        raise RuntimeError('Generated repairs require a clean checkout')
    files = tracked()
    package = content('package.json')
    if 'package-lock.json' not in files:
        raise RuntimeError('No tracked npm lockfile; manual repair required')
    install = subprocess.run(
        ['npm', 'ci', '--ignore-scripts', '--no-audit', '--no-fund'],
        text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=child_environment(),
    )
    print(install.stdout)
    if install.returncode:
        if 'EUSAGE' not in install.stdout or not LOCK_MISMATCH.search(install.stdout):
            raise RuntimeError('npm ci failed for a reason other than lockfile synchronization')
        run('npm', 'install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund')
        if content('package.json') != package:
            raise RuntimeError('Lock synchronization changed package.json')
        run('npm', 'ci', '--ignore-scripts', '--no-audit', '--no-fund')
    lock_digest = digest('package-lock.json')
    workflows = [p for p in files if re.fullmatch(r'\.github/workflows/[^/]+\.ya?ml', p)]
    prettier = Path('node_modules/.bin/prettier')
    if workflows and prettier.exists():
        before = {p: content(p) for p in workflows}
        run(str(prettier), '--write', *workflows)
        for path, original in before.items():
            if workflow_data(original) != workflow_data(content(path)):
                raise RuntimeError(f'Formatter changed workflow semantics: {path}')
    if digest('package-lock.json') != lock_digest:
        raise RuntimeError('Workflow formatting changed the npm-generated lockfile')
    allowed = set(workflows) | {'package-lock.json'}
    if changes() - allowed:
        raise RuntimeError(f'Unexpected generated changes: {sorted(changes() - allowed)}')


def verify_generated():
    files = tracked()
    for path in changes():
        if path not in files:
            raise RuntimeError(f'New generated file: {path}')
        content(path)
        if path == 'package-lock.json':
            continue
        if not re.fullmatch(r'\.github/workflows/[^/]+\.ya?ml', path):
            raise RuntimeError(f'Unexpected generated change: {path}')
        original = run('git', 'show', f'HEAD:{path}', capture=True)
        if workflow_data(original) != workflow_data(content(path)):
            raise RuntimeError(f'Workflow semantics changed: {path}')


def verify_source():
    for path in changes():
        if path not in tracked() or (path != 'package-lock.json' and not ALLOWED_SOURCE.match(path)):
            raise RuntimeError(f'Unexpected source repair: {path}')
        digest(path)


def snapshot(filename, targets):
    # Anything not explicitly offered to the agent must remain byte-for-byte
    # identical. In particular, workflows, lockfiles and guard scripts are never
    # AI edit targets. Generated changes happen before this snapshot.
    files = tracked()
    if not set(targets) <= set(files):
        raise RuntimeError('Agent targets must already be tracked')
    if any(not ALLOWED_SOURCE.match(p) and p != 'README.md' for p in targets):
        raise RuntimeError('Agent target outside supported source paths')
    data = {p: digest(p) for p in files if p not in targets}
    Path(filename).write_text(json.dumps({
        'protected': data, 'targets': targets, 'files': files,
        'modes': {p: bool(Path(p).stat().st_mode & 0o111) for p in files},
        'head': run('git', 'rev-parse', 'HEAD', capture=True).strip(),
        'index': run('git', 'write-tree', capture=True).strip(),
    }))


def verify_snapshot(filename, ignored=()):
    data = json.loads(Path(filename).read_text())
    if run('git', 'rev-parse', 'HEAD', capture=True).strip() != data['head']:
        raise RuntimeError('Agent or validation changed Git HEAD')
    if run('git', 'write-tree', capture=True).strip() != data['index']:
        raise RuntimeError('Agent or validation changed the Git index')
    for path, executable in data['modes'].items():
        if path in ignored:
            continue
        if bool(Path(path).stat().st_mode & 0o111) != executable:
            raise RuntimeError(f'Agent or validation changed file mode: {path}')
    for path, original in data['protected'].items():
        if path in ignored:
            continue
        if digest(path) != original:
            raise RuntimeError(f'Agent changed protected file: {path}')
    if set(tracked()) != set(data['files']):
        raise RuntimeError('Agent changed tracked file set')
    new = run('git', 'ls-files', '--others', '--exclude-standard', '-z', capture=True)
    if new:
        raise RuntimeError('Agent created unexpected files')
    for path in data['targets']:
        digest(path)  # reject deletions and symlinks, too


def validation_snapshot(filename):
    snapshot(filename, [])
    data = json.loads(Path(filename).read_text())
    package = json.loads(content('package.json'))
    outputs = [p for p in VALIDATION_OUTPUTS.get(package.get('name'), ()) if p in data['files']]
    if set(outputs) & changes():
        raise RuntimeError('Generated build outputs were already modified before validation')
    data['validation_outputs'] = outputs
    Path(filename).write_text(json.dumps(data))


def verify_validation(filename):
    data = json.loads(Path(filename).read_text())
    outputs = data.get('validation_outputs', [])
    # First prove every source/manifest/workflow and Git state stayed untouched.
    # Never silently discard modifications to those files to obtain a green run.
    verify_snapshot(filename, ignored=outputs)
    for path in outputs:
        p = Path(path)
        if p.is_symlink() or any(parent.is_symlink() for parent in p.parents):
            raise RuntimeError(f'Build output became a symlink: {path}')
    if outputs:
        run('git', 'restore', '--source=HEAD', '--worktree', '--', *outputs)
    verify_snapshot(filename)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['generated', 'generated-verify', 'source-verify', 'agent', 'snapshot', 'verify', 'validation-snapshot', 'validation-verify'])
    parser.add_argument('args', nargs=argparse.REMAINDER)
    args = parser.parse_args()
    if args.mode == 'generated':
        generated_repairs()
    elif args.mode == 'generated-verify':
        verify_generated()
    elif args.mode == 'source-verify':
        verify_source()
    elif args.mode == 'agent':
        checked_agent(args.args)
    elif args.mode == 'snapshot':
        snapshot(args.args[0], args.args[1:])
    elif args.mode == 'validation-snapshot':
        validation_snapshot(args.args[0])
    elif args.mode == 'validation-verify':
        verify_validation(args.args[0])
    else:
        verify_snapshot(args.args[0])


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, subprocess.CalledProcessError, OSError, ValueError, yaml.YAMLError) as error:
        print(f'::error::{error}', file=sys.stderr)
        sys.exit(1)
