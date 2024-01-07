import * as core from '@actions/core';
import crypto from 'crypto';
import { resolve } from 'node:path';
import { readJsonFile, writeJsonFile } from 'nx/src/utils/fileutils.js';
import { workspaceRoot } from 'nx/src/utils/workspace-root.js';
import argv from 'yargs-parser';
import { execFileSync } from 'node:child_process';
import { nx, runner } from './nx.js';
const tmpRunnerID = crypto.randomUUID();
const nxJsonPath = resolve(workspaceRoot, 'nx.json');
const overrideNxJson = () => {
    const nxJson = readJsonFile(nxJsonPath);
    writeJsonFile(nxJsonPath, {
        ...nxJson.tasksRunnerOptions,
        [tmpRunnerID]: {
            runner
        }
    });
    return {
        revert: () => writeJsonFile(nxJsonPath, nxJson)
    };
};
export function run() {
    const args = argv(core.getInput('nx'))._;
    try {
        const { revert } = overrideNxJson();
        execFileSync(nx, [...args, `--runner=${tmpRunnerID}`], { stdio: 'inherit' });
        revert();
    }
    catch (error) {
        core.setFailed(error);
    }
}