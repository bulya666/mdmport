const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MARKER = path.join(__dirname, '..', '.npm_update_done');

function runUpdateOnce() {
  if (fs.existsSync(MARKER)) {
    console.log('Skipping npm update — already run on this machine.');
    return 0;
  }

  console.log('First start detected — running `npm update`...');

  const repoRoot = path.join(__dirname, '..');
  const { execSync } = require('child_process');
  try {
    execSync('npm update', { stdio: 'inherit', cwd: repoRoot, env: process.env, shell: true });
  } catch (err) {
    console.error('Failed to run npm update:', err);
    return 2;
  }

  try {
    fs.writeFileSync(MARKER, new Date().toISOString());
    console.log('Created marker file:', MARKER);
  } catch (err) {
    console.warn('npm update succeeded but failed to write marker file:', err);
  }

  return 0;
}

const code = runUpdateOnce();
process.exit(code);
