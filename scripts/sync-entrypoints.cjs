'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const entries = require('./entrypoints.cjs');
const dist = path.resolve(__dirname, '../dist');

function dependencies(source) {
  return [...source.matchAll(/importScripts\(([^)]+)\);/g)]
    .flatMap(match => [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]));
}

function sync(check = true) {
  const htmlPath = path.join(dist, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  const loaded = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  if (check) assert.deepEqual(loaded, entries.browser, 'Browser dependency order differs from entrypoints.cjs');
  else {
    const block = entries.browser.map(file => `<script src="${file}"></script>`).join('\n');
    html = html.replace(/<script src="[^"]+"><\/script>(?:\s*<script src="[^"]+"><\/script>)*/, block);
    fs.writeFileSync(htmlPath, html);
  }

  for (const [file, modules] of Object.entries(entries.workers)) {
    const target = path.join(dist, file);
    let source = fs.readFileSync(target, 'utf8');
    const relative = modules.map(module => path.posix.relative(path.posix.dirname(file), module));
    if (check) assert.deepEqual(dependencies(source), relative, `${file} dependency order differs`);
    else {
      let first = true;
      source = source.replace(/importScripts\([^)]+\);/g, () => {
        if (!first) return '';
        first = false;
        return 'importScripts(\n' + relative.map(name => `  '${name}'`).join(',\n') + '\n);';
      });
      fs.writeFileSync(target, source);
    }
  }
}

module.exports = { sync };
if (require.main === module) {
  sync(!process.argv.includes('--write'));
  console.log('Entrypoint dependencies synchronized.');
}
