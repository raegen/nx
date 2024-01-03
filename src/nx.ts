import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const getModule = (
  entry: string
): {
  main: string
  root: string | undefined
} => {
  const name = entry.includes('/')
    ? entry.startsWith('@')
      ? entry.split('/').slice(0, 2).join('/')
      : entry.split('/')[0]
    : entry
  const require = createRequire(__filename)

  return {
    main: require.resolve(entry),
    root: require.resolve.paths(entry)?.find(p => existsSync(join(p, name)))
  }
}

const { root } = getModule('nx')
if (!root) {
  throw new Error(
    'Could not resolve nx package, is it installed? Did you install node modules prior to running the action? This action requires nx package to run.'
  )
}
export const nx = resolve(root, 'bin', 'nx.js')

export const runner = getModule('@raegen/github-runner').main
