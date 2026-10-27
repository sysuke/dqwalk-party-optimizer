'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { browser, workers } = require('../scripts/entrypoints.cjs');
const dist = path.resolve(__dirname, '../dist');
function test(name, run) { run(); console.log('PASS ' + name); }

test('HTML and all workers match the declared dependency order', () => {
  require('../scripts/sync-entrypoints.cjs').sync();
});
test('Active entrypoints cannot load the legacy calculation path', () => {
  assert(!fs.existsSync(path.join(dist, 'legacy')), 'Historical fixtures must not be deployed');
  for (const file of [...browser, ...Object.values(workers).flat()]) {
    assert(!file.startsWith('legacy/'), file);
    assert(fs.statSync(path.join(dist, file)).isFile(), file);
  }
});
test('Every deployed JavaScript file has a declared browser or worker consumer',()=>{
  function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
  const actual=files(dist).filter(file=>file.endsWith('.js')).map(file=>path.relative(dist,file).replace(/\\/g,'/')).sort();
  const declared=[...new Set([...browser,...Object.keys(workers),...Object.values(workers).flat()])].sort();
  assert.deepEqual(actual,declared,'Remove orphan code or declare its active consumer');
});
test('Every UI worker URL resolves from the document root', () => {
  const referenced = new Set();
  for (const file of browser.filter(file => file.startsWith('ui/'))) {
    const source = fs.readFileSync(path.join(dist, file), 'utf8');
    for (const [, worker] of source.matchAll(/new Worker\('([^']+)'\)/g)) {
      assert(workers[worker], worker);
      assert(fs.statSync(path.join(dist, worker)).isFile(), worker);
      referenced.add(worker);
    }
  }
  assert.deepEqual([...referenced].sort(), Object.keys(workers).sort());
});
for (const file of Object.keys(workers)) test(file + ' initializes without a DOM', () => {
  const context = vm.createContext({ console });
  context.self = context;
  context.postMessage = () => {};
  context.importScripts = (...files) => {
    for (const dependency of files) {
      const absolute = path.resolve(dist, path.dirname(file), dependency);
      assert(absolute.startsWith(dist + path.sep));
      vm.runInContext(fs.readFileSync(absolute, 'utf8'), context, { filename: dependency });
    }
  };
  vm.runInContext(fs.readFileSync(path.join(dist, file), 'utf8'), context, { filename: file });
  assert.equal(typeof context.onmessage, 'function');
  assert.equal(context.document, undefined);
});
test('Styles and numerical validation link survive the directory migration', () => {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const seen = new Set();
  function checkCSS(file) {
    if (seen.has(file)) return;
    seen.add(file);
    assert(fs.existsSync(file), file);
    const css = fs.readFileSync(file, 'utf8');
    for (const [, href] of css.matchAll(/@import\s+url\(['"]([^'"]+)['"]\)/g)) checkCSS(path.resolve(path.dirname(file), href));
  }
  for (const [, href] of html.matchAll(/href="([^"#]+\.css)"/g)) checkCSS(path.join(dist, href));
  assert(seen.size >= 2, 'Base styles must be checked as well');
  const calculator = fs.readFileSync(path.join(dist, 'ui/calculator.js'), 'utf8');
  const href = calculator.match(/href="([^"]+\.json)"/)[1];
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(dist, href), 'utf8')));
});
