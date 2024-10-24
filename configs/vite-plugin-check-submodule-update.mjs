import checkForSubmoduleUpdates from './check-submodule-update'

export default function checkSubmoduleUpdatesPlugin() {
  return {
    name: 'vite-plugin-check-submodule-updates',

    config(_, { mode }) {
      if (mode === 'production')
        return

      const hasSubmoduleUpdates = checkForSubmoduleUpdates()
      console.log(`📦 Submodule update check completed. Updates available: ${hasSubmoduleUpdates}`)

      return {
        define: {
          VITE_PLUGIN_HAS_SUBMODULE_UPDATES: hasSubmoduleUpdates.toString(),
        },
      }
    },
  }
}
