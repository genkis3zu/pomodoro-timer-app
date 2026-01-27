import os

def test_required_docs_exist():
    for p in ["docs/PLAN.md", "docs/CHANGELOG.md", "docs/SESSION_SUMMARY.md"]:
        assert os.path.exists(p), f"missing required doc: {p}"
