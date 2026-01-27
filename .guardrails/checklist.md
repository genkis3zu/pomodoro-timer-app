# Guardrail Checklist (Full Version)

このチェックリストは、Commander / ClaudeCode / Codex / Gemini の
すべてのエージェントが各サイクルの前後に必ず確認すべき共通基準である。
タスク遂行時はこの項目に従って作業し、必要なら出力内に証跡を含めること。

---

# 1. Context（文脈の正しさ）

- [ ] Context Block が冒頭に存在しているか  
- [ ] BasedOn の対象（前回出力 / ファイル）が正しいか確認  
- [ ] Summary が“コピペではなく”自分の言葉で再構築されているか  
- [ ] Objective が明確で1行になっているか  
- [ ] 前のサイクルと矛盾がないか（Commanderは最終権限として確認）

---

# 2. Relay（文脈引き継ぎ）

- [ ] Relay Header が末尾に存在するか  
- [ ] NextTarget が正しいエージェントになっているか  
- [ ] ExpectedFocus が「何を見るべきか」をはっきり示しているか  
- [ ] CarryContextFrom が Summary を1行に圧縮した内容になっているか  
- [ ] 次のAIがこの内容で迷わず動けるか（曖昧さがないか）

---

# 3. Implementation（ClaudeCode 向け）

- [ ] Task をサブタスク化し、実装可能な形に落とし込んだか  
- [ ] Diff（何を変えたか）が分かる形で提示されているか  
- [ ] Metrics（できる範囲で数値）を提示したか  
  - 例：bundle size, LCP, TTFB, API latency, coverage  
- [ ] Docs（PLAN / CHANGELOG など）を更新したか  
- [ ] OpenQuestions（最大3件）が明確かつ妥当か  
- [ ] 不要な変更・独断の仕様変更をしていないか  

---

# 4. Review（Codex 向け）

- [ ] MUST / SHOULD / CONSIDER の指摘が分類されているか  
- [ ] 指摘内容が「事実ベース」で明確か  
- [ ] 過剰な要求や別方向への暴走がないか  
- [ ] Verify（どうテストすべきか）が1〜3行で書かれているか  
- [ ] 指摘に優先度が書かれていて“実行判断できる状態”になっているか  
- [ ] Commander に判断を委ねるべき点が明確化されているか  

---

# 5. PM/Insight（Gemini PM 向け）

- [ ] Strategy（方向性）が論理的かつ過剰に抽象的でないか  
- [ ] Plan（Next Steps）が優先度付きで整理されているか  
- [ ] Decision Points（重要な判断軸）が明確に列挙されているか  
- [ ] Guidance（ClaudeCode / Codex 向けの観点）が有用か  
- [ ] 必要なら外部知見を検索し、INSIGHT.md に反映しているか  
- [ ] meta_relay を遵守して Context Block / Relay Header を含めているか  

---

# 6. Docs（ドキュメント更新）

- [ ] 今回の作業で影響したファイル・仕様が docs に反映されているか  
- [ ] PLAN.md に「なぜこれをやっているか」が整理されたか  
- [ ] CHANGELOG.md に変更点を記録したか  
- [ ] SESSION_SUMMARY.md に今回の内容が追記されているか  
- [ ] INSIGHT.md に新たな知見を追加した場合は重複がないか  
- [ ] ドキュメント間で矛盾が発生していないか  

---

# 7. Git（コミット・ブランチ運用）

- [ ] 不要なコミットを量産していないか  
- [ ] 意味のある粒度でコミットをまとめたか  
- [ ] コミットメッセージが分かりやすいか（Conventional Commits 推奨）  
- [ ] ブランチ命名規則に従っているか  
- [ ] main / production へ直接 push していないか  
- [ ] 競合が起きた場合、Commander の判断を仰いでいるか  

---

# 8. Risk（リスク管理）

- [ ] セキュリティ・パフォーマンス・UX・アクセシビリティの観点でリスクが明示されたか  
- [ ] 放置した場合の影響（Worst Case）が書かれているか  
- [ ] Codex / Gemini の指摘を踏まえて Commander が判断できる状態か  
- [ ] 次サイクルで解消すべきリスクが明示されているか  

---

# 9. Consistency（プロジェクト全体との整合性）

- [ ] app_type.yaml（アプリの型）と矛盾がないか  
- [ ] 過去のタスクと整合性が取れているか  
- [ ] 設計・命名規則とずれていないか  
- [ ] 方向性の大きなズレは Commander に確認したか  

---

# 10. Completion（サイクル完了条件）

- [ ] 全AIの出力が Context Block と Relay Header を持っている  
- [ ] Commander が「承認 / 保留 / 再実行」を判断した  
- [ ] 必要なドキュメント更新が済んだ  
- [ ] 次サイクルのタスクが明確化された  
- [ ] 不明点があれば、Commander が Context を再定義した  

---
