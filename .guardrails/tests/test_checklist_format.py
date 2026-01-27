import os

def test_checklist_min_bullets():
    assert os.path.exists(".guardrails/checklist.md")
    txt = open(".guardrails/checklist.md", encoding="utf-8").read()
    required = ["docs更新", "Compact conversation", "Commit & Push", "質問は最大3件"]
    for kw in required:
        assert kw in txt, f"checklist is missing: {kw}"
