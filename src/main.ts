import core from '@actions/core'
import crypto from 'node:crypto'
import { resolve } from 'node:path'
import { readJsonFile, writeJsonFile } from 'nx/src/utils/fileutils.js'
import { workspaceRoot } from 'nx/src/utils/workspace-root.js'
import type { NxJsonConfiguration } from 'nx/src/config/nx-json.d.ts'
import argv from 'yargs-parser'
import { execFileSync } from 'node:child_process'
import { nx, runner } from './nx.js'

const tmpRunnerID = crypto.randomUUID()
const nxJsonPath = resolve(workspaceRoot, 'nx.json')

const overrideNxJson = (): {
  revert: () => void
} => {
  const nxJson = readJsonFile<NxJsonConfiguration>(nxJsonPath)

  writeJsonFile(nxJsonPath, {
    ...nxJson.tasksRunnerOptions,
    [tmpRunnerID]: {
      runner
    }
  })

  return {
    revert: () => writeJsonFile(nxJsonPath, nxJson)
  }
}

export function run(): void {
  const args = argv(core.getInput('nx'))._ as string[]

  try {
    const { revert } = overrideNxJson()
    execFileSync(nx, [...args, `--runner=${tmpRunnerID}`], { stdio: 'inherit' })
    revert()
  } catch (error) {
    core.setFailed(error as Error)
  }
}
