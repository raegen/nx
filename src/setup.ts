import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'

execSync(
  `ln -s "${process.execPath}" /usr/bin/node && ${resolve(
    dirname(process.execPath),
    'npm'
  )} install`,
  {
    stdio: 'inherit',
    encoding: 'utf-8'
  }
)
