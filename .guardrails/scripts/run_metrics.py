#!/usr/bin/env python3
import argparse, json, yaml, re, os
from datetime import datetime, timedelta
from util import commit_msgs_since, changed_files_since, last_modified_epoch

def load_yaml(p): 
    with open(p, encoding="utf-8") as f: return yaml.safe_load(f)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default=".guardrails/config.yaml")
    ap.add_argument("--spec",   default=".guardrails/metrics.yaml")
    args = ap.parse_args()

    cfg = load_yaml(args.config)
    spec = load_yaml(args.spec)
    days = cfg["metrics_window_days"]
    msgs = commit_msgs_since(days)
    files = changed_files_since(days)

    code_roots = tuple(cfg["paths"]["code_roots"])
    docs_files = set(cfg["paths"]["docs_files"])
    guardrail_prefix = cfg["naming"]["guardrail_commit_prefix"]
    conv_re = re.compile(cfg["naming"]["conventional_regex"])

    # docs_update_rate
    code_commits = 0
    docs_touched_on_code = 0
    # 近似：ファイルリストから推定（粒度：コミット単位省略）
    code_changed = any(f.startswith(code_roots) for f in files)
    docs_changed = any(f in docs_files for f in files)
    if code_changed:
        code_commits = 1
        docs_touched_on_code = 1 if docs_changed else 0
    docs_update_rate = (docs_touched_on_code / max(code_commits,1))

    # session_summary_fresh
    sm_ep = last_modified_epoch("docs/SESSION_SUMMARY.md")
    fresh = 1 if (sm_ep and (datetime.utcnow() - datetime.utcfromtimestamp(sm_ep) <= timedelta(days=days))) else 0

    # conventional_commits_ratio
    conv_hits = sum(1 for m in msgs if conv_re.match(m or ""))
    conv_ratio = conv_hits / max(len(msgs),1)

    # guardrail_commit_count
    gr_count = sum(1 for m in msgs if m.startswith(guardrail_prefix))

    # rollback_documented（簡易）
    rollback_hits = 0
    for p in ["docs/SESSION_SUMMARY.md","docs/CHANGELOG.md"]:
        if os.path.exists(p):
            txt = open(p, encoding="utf-8", errors="ignore").read().lower()
            if any(k in txt for k in ["rollback","revert","失敗","ロールバック"]):
                rollback_hits += 1

    result = {
        "window_days": days,
        "generated_at": datetime.utcnow().isoformat()+"Z",
        "metrics": {
            "docs_update_rate": round(docs_update_rate, 3),
            "session_summary_fresh": fresh,
            "conventional_commits_ratio": round(conv_ratio, 3),
            "guardrail_commit_count": gr_count,
            "rollback_documented": rollback_hits
        },
        "thresholds": cfg["thresholds"]
    }

    # 判定
    verdict = []
    thr = cfg["thresholds"]
    if result["metrics"]["docs_update_rate"] < thr["docs_update_rate_min"]:
        verdict.append("docs_update_rate below threshold")
    if not result["metrics"]["session_summary_fresh"]:
        verdict.append("SESSION_SUMMARY is stale")
    if result["metrics"]["conventional_commits_ratio"] < thr["conventional_commits_ratio_min"]:
        verdict.append("conventional_commits ratio low")
    if result["metrics"]["rollback_documented"] < thr["rollback_documented_min"]:
        verdict.append("rollback evidence too low (risk of silent failures)")

    result["verdict"] = "NG" if verdict else "OK"
    result["notes"] = verdict

    # 出力
    out_json = spec["report"]["out_json"]
    out_md   = spec["report"]["out_md"]
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    open(out_json,"w",encoding="utf-8").write(json.dumps(result, ensure_ascii=False, indent=2))

    md = [
      f"# Guardrail Metrics ({days}d)",
      f"- generated: {result['generated_at']}",
      f"- verdict: **{result['verdict']}**",
      "## numbers",
      *[f"- {k}: {v}" for k,v in result["metrics"].items()],
      "## notes" if verdict else "## notes\n- none"
    ]
    open(out_md,"w",encoding="utf-8").write("\n".join(md))
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
