const { spawn } = require('child_process');
const path = require('path');

require('./dev-api.cjs');

const ng = spawn('npx', ['ng', 'serve', ...process.argv.slice(2)], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

ng.on('exit', (code) => process.exit(code ?? 0));
