#!/usr/bin/env python3
import sys, os, re, yaml

REQUIRED = [
  ".guardrails/checklist.md",
  ".guardrails/claude_meta.md",
  ".guardrails/codex_meta.md",
  ".guardrails/config.yaml",
  ".guardrails/metrics.yaml",
]

def must_exist():
    missing = [p for p in REQUIRED if not os.path.exists(p)]
    if missing:
        print("MISSING:", ", ".join(missing)); return False
    return True

def checklist_format_ok():
    txt = open(".guardrails/checklist.md", encoding="utf-8").read()
    ok = all(k in txt for k in ["docs更新", "Commit & Push", "質問は3件まで"])
    if not ok: print("CHECKLIST weak: required bullet not found")
    return ok

def config_yaml_ok():
    try:
        yaml.safe_load(open(".guardrails/config.yaml", encoding="utf-8"))
        return True
    except Exception as e:
        print("CONFIG YAML invalid:", e); return False

if __name__ == "__main__":
    ok = must_exist() and checklist_format_ok() and config_yaml_ok()
    sys.exit(0 if ok else 1)
