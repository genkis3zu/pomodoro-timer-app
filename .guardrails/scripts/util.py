import subprocess, re
from datetime import datetime, timedelta

def git(args:str|list[str])->str:
    if isinstance(args, str): args = args.split()
    return subprocess.check_output(["git", *args], text=True).strip()

def commit_msgs_since(days:int):
    since = (datetime.utcnow() - timedelta(days=days)).isoformat(timespec="seconds")+"Z"
    out = git(["log","--since",since,"--pretty=%s"])
    return [l for l in out.splitlines() if l.strip()]

def changed_files_since(days:int):
    since = (datetime.utcnow() - timedelta(days=days)).isoformat(timespec="seconds")+"Z"
    out = git(["log","--since",since,"--name-only","--pretty=format:"])
    return [l for l in out.splitlines() if l.strip()]

def last_modified_epoch(path:str)->int|None:
    try:
        ts = git(["log","-1","--format=%ct","--",path])
        return int(ts)
    except subprocess.CalledProcessError:
        return None
