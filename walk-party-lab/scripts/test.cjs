'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
require('./sync-entrypoints.cjs').sync();
let total = 0;
for (const file of fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.cjs')).sort()) {
  const result = spawnSync(process.execPath, [path.join(root, 'tests', file)], { cwd: root, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stdout.write((result.stdout || '') + (result.stderr || ''));
    process.exit(result.status || 1);
  }
  const passed = result.stdout.split('\n').filter(line => line.startsWith('PASS ')).length;
  total += passed;
  console.log(`${file}: ${passed} passed`);
}
console.log(`TOTAL ${total} passed`);
