/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import path from 'node:path'
import process, { exit } from 'node:process'
import fse from 'fs-extra'

export function createManualChunks(fileName) {
  const fileNameWithoutExtension = fileName.split('/').at(-1).split('.').at(0)
  // https://rollupjs.org/configuration-options/#output-manualchunks

  if (fileName.includes('frontend-pro')) {
    return `pro-chunk-${fileNameWithoutExtension}`
  }

  if (fileName.includes('node_modules')) {
    if (fileName.includes('/lucide-react@')) {
      return `icons/${fileNameWithoutExtension}`
    }
    if (fileName.includes('antd@')) {
      return 'js/antd'
    }
    // if (fileName.includes('framer-motion@')) {
    //   return 'js/framer-motion'
    // }

    return 'js/vendor'
  }
}

export function commandExistsSync(command) {
  try {
    execSync(command)
    return true
  }
  catch {
    console.log(`${command} not found`)
    return false
  }
}

export function exitIfNotLinux() {
  if (process.platform === 'win32') {
    console.log('⛔ Windows detected, try to run from linux, mac or wsl in windows')
    exit()
  }
}

export function exitIfWpCliNotInstalled() {
  if (!commandExistsSync('wp')) {
    console.log('⛔ wp-cli not found, please install it first')
    exit()
  }
}

export async function copyFilesAndFolders(filesAndFoldersArr, destination) {
  try {
    const copyTasks = filesAndFoldersArr.map(async (item) => {
      try {
        const destinationPath = path.join(destination, path.basename(item))
        console.log(`➡️  Copying  ${item}`)
        return fse.copy(item, destinationPath, { overwrite: true })
      }
      catch (error) {
        console.log(`Error copying ${item}:`, error)
        return `${item} not found`
      }
    })

    const results = await Promise.all(copyTasks)

    const errors = results.filter(result => typeof result === 'string')
    if (errors.length > 0) {
      console.log('Errors:\n', errors.join('\n'))
    }
    else {
      console.log('All files and directories copied successfully.')
    }
  }
  catch (error) {
    console.error('Unexpected error:', error)
  }
}
