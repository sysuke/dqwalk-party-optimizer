# 物理1発の段階別診断

リポジトリ直下で実行する。追加パッケージ不要。

```sh
node scripts/trace-measurement.cjs --template > /tmp/dqw-measurement-input.json
# 独立に確認できた値と根拠をJSONへ記入する
node scripts/trace-measurement.cjs /tmp/dqw-measurement-input.json
```

テンプレートは全値null・全出典空欄。未確認項目はそのままにする。未知の値を0や既定値で埋めない。全項目が埋まるまで `status: unresolved` と不足項目を返し、終了コード2になる。正常な条件付き計算は終了コード0、不正入力・ファイルエラーは1。

`params` は `PhysicalCalculator.defaults()` と同じ項目を、既定値なしで要求する。`sources` の同名キーへ各入力の根拠を書く。「不明」は根拠にならない。文字列の真偽はプログラムでは検証できないため、計算できても入力が確定した証明にはならない。

- attackは装備能力を再加算する前提ではなく、照合する表示攻撃力。attackStages・levelUp等の戦闘中補正は別に指定する。
- slash・elementBonus・criticalBonus・criticalExtra等の百分率入力はポイント単位。生補正と増幅後の値を混同せず、PhysicalCalculator側が行う増幅を二重に入れない。
- hitsは必ず1。複数発の合計・追撃・複数敵はこの診断の対象外。
- criticalGuard.activeは攻撃時点のガード有無、reductionは0〜100の軽減率、sourceはその根拠。ガード有効時は軽減率も必須。通常攻撃には会心ガードを適用しない。
- 観測ダメージは入力しない。入力しても計算には使用されない。敵条件や補正を観測値から逆算しない。

出力は使用入力と根拠、実効攻撃・守備、基礎値と乱数幅、補正群、上下端それぞれの丸め段階、会心ガード前後を記録する。`stages.first` は主補正・会心後の切り捨て、`second` は専用スキル・チャージ後の切り捨て、`third` は二刀流係数後の切り上げ。既存の `PhysicalCalculator` を呼び、独自の物理式を追加していない。

完成した入力でも結果は `conditional-model-trace`。入力の根拠は未検証で、公式内部式や実機一致の認証ではない。実測4件は必要な敵条件・状態が未確定のため、この機能で再現できたとは扱わない。保存されたfixtureへテンプレート値を上書きしない。

関連：[切り分け状況](MEASUREMENT-TRIAGE.md)、[生補正の診断](MEASURED-CORRECTIONS.md)。

凍結とtypeDebuffは加算した `factors.damageTakenGroup` を適用する。個別表示のfreeze/typeDebuffをもう一度乗算しない。[参照実装との照合](MEASUREMENT-SOURCES.md)を参照。
