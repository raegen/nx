import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'

execSync(
  `sudo ln -sf "${process.execPath}" /usr/bin/node && ${resolve(
    dirname(process.execPath),
    'npm'
  )} --prefix ${fileURLToPath(import.meta.resolve('..'))} install`,
  {
    stdio: 'inherit',
    encoding: 'utf-8'
  }
)
