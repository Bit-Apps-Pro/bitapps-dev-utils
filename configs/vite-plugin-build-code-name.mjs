import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export default function generateBuildCodeNamePlugin({ codeName, dir }) {
  return {
    name: 'vite-plugin-build-code-name',

    closeBundle() {
      try {
        const outputDir = dir

        const filePath = join(outputDir, 'build-code-name.txt')

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true })
        }

        writeFileSync(filePath, codeName, { encoding: 'utf-8' })
      }
      catch (error) {
        console.error('❌ Error writing build hash:', error)
      }
    },
  }
}
