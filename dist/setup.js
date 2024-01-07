import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
execSync(`${resolve(dirname(process.execPath), 'npm')} install`, {
    stdio: 'inherit',
    encoding: 'utf-8'
});
