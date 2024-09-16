/**
 * Replace imports of pro modules with the correct URL
 * @param {serverVarName} param0 - The name of the server variable that holds the pro module URL
 * @returns null
 */
export default function replaceProImports({ serverVarName }) {
  return {
    name: 'replace-pro-imports',
    generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key].code) {
          const proModuleImportFindRegex = /"((?:\.{1,2}\/)+)bit-pi-pro\/assets\/(pro-module-[^"]+)"/g
          const proModuleUrlVar = `window.${serverVarName}.proModuleUrl`
          // eslint-disable-next-line prefer-template
          const replacer = '`${' + proModuleUrlVar + '}$2`'

          bundle[key].code = bundle[key].code.replace(proModuleImportFindRegex, replacer)
        }
      }
    },
  }
}
