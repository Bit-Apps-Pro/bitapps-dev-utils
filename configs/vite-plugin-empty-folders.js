import fse from 'fs-extra'

/**
 * Vite plugin to empty specific folders before build.
 * @param {string[]} folders - Array of folder paths to empty.
 */
export default function emptyFoldersPlugin(folders) {
  return {
    name: 'vite-plugin-empty-folders',
    buildStart() {
      folders.forEach((folder) => {
        // eslint-disable-next-line no-console
        console.log(`Emptying folder: ${folder}`)
        fse.remove(folder)
      })
    },
  }
}
