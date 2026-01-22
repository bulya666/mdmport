const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MARKER = path.join(__dirname, '..', '.npm_update_done');

function runUpdateOnce() {
  if (fs.existsSync(MARKER)) {
    console.log('Frissítés átlépése — már futott ezen a gépen.');
    return 0;
  }

  console.log('Első indítás észlelve — futtatás: `npm update`...');

  const repoRoot = path.join(__dirname, '..');
  const { execSync } = require('child_process');
  try {
    execSync('npm update', { stdio: 'inherit', cwd: repoRoot, env: process.env, shell: true });
  } catch (err) {
    console.error('Hiba a frissítés során:', err);
    return 2;
  }

  try {
    fs.writeFileSync(MARKER, new Date().toISOString());
    console.log('Marker fájl létrehozva:', MARKER);
  } catch (err) {
    console.warn('npm update sikeres, de a marker fájl írása nem sikerült:', err);
  }

  return 0;
}

const code = runUpdateOnce();
process.exit(code);
