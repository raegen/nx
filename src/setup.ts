import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'

execSync(
  `sudo ln -s "${process.execPath}" /usr/bin/node && ${resolve(
    dirname(process.execPath),
    'npm'
  )} install -C ${import.meta.resolve('..')}`,
  {
    stdio: 'inherit',
    encoding: 'utf-8'
  }
)
