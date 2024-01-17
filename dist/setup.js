import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';
execSync(`sudo ln -sf "${process.execPath}" /usr/bin/node && ${resolve(dirname(process.execPath), 'npm')} install -g yarn`, {
    stdio: 'inherit',
    encoding: 'utf-8'
});
execSync(`yarn --cwd ${fileURLToPath(import.meta.resolve('..'))}`, {
    stdio: 'inherit',
    encoding: 'utf-8'
});
