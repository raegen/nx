import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'url';
const getModule = (entry, from = resolve(process.cwd(), 'package.json')) => {
    const name = entry.includes('/')
        ? entry.startsWith('@')
            ? entry.split('/').slice(0, 2).join('/')
            : entry.split('/')[0]
        : entry;
    const require = createRequire(from);
    return {
        main: require.resolve(entry),
        root: require.resolve
            .paths(entry)
            ?.map(p => join(p, name))
            .find(p => existsSync(p))
    };
};
const { root } = getModule('nx');
if (!root) {
    throw new Error('Could not resolve nx package, is it installed? Did you install node modules prior to running the action? This action requires nx package to run.');
}
export const nx = resolve(root, 'bin', 'nx.js');
export const workspaceRoot = resolve(process.cwd());
export const nxJsonPath = resolve(workspaceRoot, 'nx.json');
export const runner = getModule('@raegen/github-runner', fileURLToPath(import.meta.url)).main;
