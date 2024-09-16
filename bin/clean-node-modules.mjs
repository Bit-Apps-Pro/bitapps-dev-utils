#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { rimraf } from 'rimraf'

const pathsToDelete = [
  path.join(process.cwd(), 'node_modules'),
  path.join(process.cwd(), 'package-lock.json'),
  path.join(process.cwd(), 'yarn.lock'),
  path.join(process.cwd(), 'pnpm-lock.yaml'),
]

try {
  const deletionPromises = pathsToDelete.map(async p => rimraf(p))

  await Promise.all(deletionPromises)

  // eslint-disable-next-line no-console
  console.log('All files and directories have been deleted.')
}
catch (err) {
  console.error(`Error during deletion: ${err.message}`)
}
