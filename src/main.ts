import core from '@actions/core'
import crypto from 'node:crypto'
import { readJsonFile, writeJsonFile } from 'nx/src/utils/fileutils.js'
import type { NxJsonConfiguration } from 'nx/src/config/nx-json.d.ts'
import { execFileSync } from 'node:child_process'
import { nx, nxJsonPath, runner } from './nx.js'

const tmpRunnerID = crypto.randomUUID()

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
  const args = core.getInput('nx').split(' ')

  try {
    const { revert } = overrideNxJson()
    execFileSync(nx, [...args, `--runner=${tmpRunnerID}`], { stdio: 'inherit' })
    revert()
  } catch (error) {
    core.setFailed(error as Error)
  }
}
