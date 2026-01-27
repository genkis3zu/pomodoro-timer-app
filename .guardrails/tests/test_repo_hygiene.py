import re
import subprocess

CONV = re.compile(r"^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\\(.+\\))?:\\s")

def git(args):
    return subprocess.check_output(["git", *args], text=True).strip()

def test_conventional_commits_sample():
    msgs = git(["log","-n","10","--pretty=%s"]).splitlines()
    assert any(CONV.match(m or "") for m in msgs), "no conventional-looking commit in last 10"
