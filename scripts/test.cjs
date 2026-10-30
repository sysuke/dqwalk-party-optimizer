'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const suites = {
  ui: ['architecture.cjs', 'ui17.cjs', 'ui35.cjs', 'serve.cjs'],
  measurements: ['measured-corrections.cjs', 'measurement-trace.cjs', 'measurement36.cjs', 'measurement39.cjs', 'measurement50.cjs', 'measurement51.cjs', 'measurement52.cjs']
};
const args = process.argv.slice(2);
const suite = args.find(arg => arg !== '--list');
if (args.some(arg => arg !== '--list' && arg !== suite) || (suite && !Object.hasOwn(suites, suite))) {
  console.error('Usage: npm test -- [ui|measurements] [--list]');
  process.exit(1);
}
const files = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.cjs')).sort();
const selected = suite ? files.filter(file => suites[suite].includes(file)) : files;
if (suite && selected.length !== suites[suite].length) throw new Error('Test suite references a missing file: ' + suite);
if (args.includes('--list')) {
  console.log(selected.join('\n'));
  process.exit(0);
}
let total = 0;
const durations = [];
for (const file of selected) {
  const started = performance.now();
  const result = spawnSync(process.execPath, [path.join(root, 'tests', file)], { cwd: root, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stdout.write((result.stdout || '') + (result.stderr || ''));
    process.exit(result.status || 1);
  }
  const passed = result.stdout.split('\n').filter(line => line.startsWith('PASS ')).length;
  if (!passed) throw new Error(file + ': no PASS results reported');
  total += passed;
  const seconds = (performance.now() - started) / 1000;
  durations.push({ file, seconds });
  console.log(`${file}: ${passed} passed (${seconds.toFixed(1)}s)`);
}
console.log(`TOTAL ${total} passed (${suite || 'all'}, ${selected.length} files)`);
console.log('Slowest: ' + durations.sort((a, b) => b.seconds - a.seconds).slice(0, 3).map(row => `${row.file} ${row.seconds.toFixed(1)}s`).join(', '));
