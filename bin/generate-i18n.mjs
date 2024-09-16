#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
/**
 * Translation (i18n) Generation Commands
 *
 * How it Works:
 *  - Step 1: Extract translatable strings from .ts and .tsx files using react-gettext-parser to generate a .pot file.
 *  - Step 2: Convert the .pot file into a PHP array that contains the extracted strings.
 *  - Step 3: Extract translatable strings from PHP files, merge them with frontend strings, and generate the final .pot file using the plugin slug.
 *
 * Contributors: Script originally written by @anisurov, refactored by @arif-un.
 */
import dotenv from 'dotenv'

import { exitIfNotLinux, exitIfWpCliNotInstalled } from '../utils/build-helpers.mjs'
import { convertPOTToPHP } from '../utils/pot-to-php.mjs'

const { PLUGIN_SLUG } = dotenv.config().parsed
const execOptions = { stdio: 'inherit' }

const FRONTEND_POT_FILE = 'languages/frontend.pot'
const GETTEXT_PARSER_CONFIG = './.config/gettext-parser.config.cjs'
const GETTEXT_PARSER_FILES_GLOB
  = './frontend/**/{*.js,*.jsx,*.ts,*.tsx} ./pro/frontend-pro/pro-module/src/**/{*.js,*.jsx,*.ts,*.tsx}'
const FRONTEND_EXTRACTED_STRINGS_PHP_FILE = 'languages/frontend-extracted-strings.php'

const POT_FILE_HEADER = JSON.stringify({
  'Last-Translator': 'Bit Apps <developer@bitapps.pro>',
  'Language-Team': 'Bit Apps <support@bitapps.pro>',
  'PO-Revision-Date': '',
})

exitIfNotLinux()
exitIfWpCliNotInstalled()

if (!existsSync('languages'))
  mkdirSync('languages')

execSync(
  `pnpm react-gettext-parser --output ${FRONTEND_POT_FILE} --config ${GETTEXT_PARSER_CONFIG}  ${GETTEXT_PARSER_FILES_GLOB}`,
  execOptions,
)

convertPOTToPHP(FRONTEND_POT_FILE, FRONTEND_EXTRACTED_STRINGS_PHP_FILE, PLUGIN_SLUG)

execSync(
  `wp i18n make-pot  .  languages/${PLUGIN_SLUG}.pot  --slug='${PLUGIN_SLUG}'  --ignore-domain  --skip-js  --include='backend,pro/backend/,languages'  --headers='${POT_FILE_HEADER}'`,
  execOptions,
)
