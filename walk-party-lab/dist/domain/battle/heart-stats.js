'use strict';
(function(root) {
  const keys=['hp','mp','attack','defense','magic','heal','speed','dex'];
  const colorStat={赤:'attack',黄:'defense',紫:'magic',緑:'heal',青:'speed'};
  function calculate(heart,slot='虹',options={}) {
    const white=heart.color==='白',colors=[...new Set(slot.split('+'))];
    const factors=Object.fromEntries(keys.map(key=>[key,100]));
    let factor=1;
    if(white) {
      if(colors.includes('虹')||colors.includes('白')) {
        const base=options.tier==='basic'||options.tier==='advanced'?110:115;
        for(const key of keys) factors[key]=base;
      }
      for(const color of colors) if(colorStat[color]) factors[colorStat[color]]+=colors.length===1?100:50;
      factor=null;
    } else {
      factor=heart.color==='黒'?(colors.includes('黒')?(options.matchFactor??1.3):1):heart.noColorBonus?1:slot==='虹'||colors.some(color=>heart.color.split('+').includes(color))?(options.matchFactor??1.3):1;
      for(const key of keys) factors[key]=factor*100;
    }
    const stats=Object.fromEntries(keys.map(key=>[key,white?Math.ceil((heart.stats?.[key]||0)*factors[key]/100):Math.floor((heart.stats?.[key]||0)*factor)]));
    const labels={hp:'HP',mp:'MP',attack:'攻撃',defense:'守備',magic:'攻魔',heal:'回魔',speed:'すばやさ',dex:'器用'};
    const factorLabel=white?'白・'+[...new Set(Object.values(factors))].map(value=>keys.filter(key=>factors[key]===value).map(key=>labels[key]).join('/')+'×'+value/100).join('、'):String(factor);
    return {stats,factor,factors:Object.fromEntries(keys.map(key=>[key,factors[key]/100])),factorLabel,rounding:white?'ceil':'floor'};
  }
  root.HeartStats={calculate};
})(typeof window==='undefined'?globalThis:window);
