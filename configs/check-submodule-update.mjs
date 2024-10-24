import { execSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

function runCommand(command, cwd = process.cwd()) {
  try {
    return execSync(command, { cwd, stdio: 'pipe', encoding: 'utf8' }).trim()
  }
  catch {
    console.error(`Error executing command: ${command}`)
  }
}

export default function checkForSubmoduleUpdates() {
  try {
    runCommand('git submodule init')

    // Get the list of submodules
    const submodulePaths = runCommand('git config --file .gitmodules --name-only --get-regexp path')
      ?.split('\n')
      ?.map(line => line.replace('.path', ''))

    if (!submodulePaths) {
      return false
    }

    // Check if any submodule is outdated
    for (const submodule of submodulePaths) {
      const submodulePath = runCommand(`git config --file .gitmodules --get ${submodule}.path`) || ''
      const submoduleAbsolutePath = path.resolve(submodulePath)

      // Fetch the latest changes from the remote
      runCommand('git fetch', submoduleAbsolutePath)

      // Get the current commit of the submodule in the local repository
      const currentCommit = runCommand('git rev-parse HEAD', submoduleAbsolutePath)

      // Get the latest commit from the origin
      const remoteCommit = runCommand('git rev-parse origin/HEAD', submoduleAbsolutePath)

      // If the commits are different, an update is needed
      if (currentCommit !== remoteCommit) {
        return true // An update is available
      }
    }

    return false // All submodules are up to date
  }
  catch (error) {
    console.error('Failed to check for submodule updates:', error)
    return false
  }
}
