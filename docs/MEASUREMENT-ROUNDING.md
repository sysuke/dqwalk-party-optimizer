# 凍結Lv1と強化4段階：丸め順の限定的な切り分け

2026-10-28。実測値や未知の敵能力を使わず、凍結の被ダメージ1.10倍と遺跡強化4の0.20倍について数学的に確認した。

## 確認できた範囲

両補正の直前に非負整数ダメージDがあり、この2補正を最後に掛け、各段階で切り捨てるという**仮定**を置く。

- 凍結を先にする：floor(floor(D × 11/10) / 5)
- 強化軽減を先にする：floor(floor(D / 5) × 11/10)
- 一括で掛ける：floor(D × 11/50)

この3方式の差は、任意の非負整数Dで最大1。例えばD=19では順に4、3、4になる。Dへ50を足すと各方式の結果はすべて11増えるため、D=0〜49の全列挙で全非負整数を検証できる。浮動小数点の境界誤差を避け、下記はBigIntで実行した。

```js
const assert = require('node:assert/strict');
const methods = d => [((d * 11n / 10n) / 5n),
                      ((d / 5n) * 11n / 10n),
                      (d * 11n / 50n)];
let maximum = 0n;
for (let d = 0n; d < 50n; d++) {
  const values = methods(d);
  const shifted = methods(d + 50n);
  values.forEach((value, i) => assert.equal(shifted[i], value + 11n));
  const sorted = [...values].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const difference = sorted[2] - sorted[0];
  if (difference > maximum) maximum = difference;
}
assert.equal(maximum, 1n);
assert.deepEqual(methods(19n), [4n, 3n, 4n]);
console.log('50 residues checked; maximum difference = ' + maximum);
```

## 結論の制限

これは遺跡での実機合成順の確定ではない。次の場合に「差は1以内」という結果を転用してはいけない。

- 補正の間や後に、さらに別の倍率・上限・シールド処理等が入る場合。
- 途中入力が整数Dではない場合。
- 被ダメージ増減を加算群として扱う等、そもそもの合成方法が異なる場合。
- 四捨五入・切り上げ等、実機の丸めが仮定と異なる場合。

特に現行 `PhysicalCalculator` は凍結倍率を `AutoDamage.physical` のsharedへ含め、他の乗算群と合わせた後に最初の切り捨てを行う。強化4の軽減は実装されていない。このため、上の3方式は既存エンジンの実行順そのものを表すものではない。

乗算を仮定した合計倍率は0.22。一方、仮に同じ増減群へ+10%と-80%を足す方式なら0.30になる。この差は丸め誤差ではなく、合成規則の差である。実測に近い方を選ぶ手段にはせず、独立した仕様根拠または条件をそろえた測定が必要。

したがって、限定した3方式の差が1を超えるような比較結果を得た場合、その差を「この2補正の最後の切り捨て順だけ」で説明することはできない。ただし、現在の実測4件はその仮定を満たす入力がそろっておらず、今回の確認で一致・不一致を判定していない。

関連：[掲載値と適用範囲](MEASUREMENT-SOURCES.md)、[段階別診断](MEASUREMENT-TRACE.md)。
