import core from '@actions/core';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { nx, nxJsonPath, runner } from './nx.js';
import { createProjectGraphAsync, cacheDir } from '@nx/devkit';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const cacheDirectory = core.getInput('cacheDirectory') || resolve(cacheDir, 'remote');
const targets = Array.from(new Set(Object.values((await createProjectGraphAsync()).nodes)
    .map(({ data }) => Object.keys(data.targets || {}).filter(target => data.targets?.[target].cache !== false))
    .flat()));
const readJson = async (path) => JSON.parse(await readFile(path, 'utf-8'));
const writeJson = async (path, content) => writeFile(path, JSON.stringify(content));
const id = crypto.randomUUID();
const overrideNxJson = async () => {
    const nxJson = await readJson(nxJsonPath);
    await writeJson(nxJsonPath, {
        ...nxJson,
        tasksRunnerOptions: {
            ...nxJson.tasksRunnerOptions,
            [id]: {
                runner,
                options: {
                    cacheDirectory,
                    cacheableOperations: targets
                }
            }
        }
    });
    return {
        revert: async () => writeJson(nxJsonPath, nxJson)
    };
};
export async function run() {
    const args = core.getInput('nx').split(' ');
    try {
        const { revert } = await overrideNxJson();
        execFileSync(nx, [...args, `--runner=${id}`], { stdio: 'inherit' });
        await revert();
    }
    catch (error) {
        core.setFailed(error);
    }
}
