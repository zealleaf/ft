/* eslint-disable no-console */
import { fileURLToPath } from 'url'
import pic from 'picocolors'
import prt from 'prompts'
import type { Color } from 'ora'
import ora from 'ora'
import { $, path } from 'zx'
import rimraf from 'rimraf'
import { read } from 'fsxx'
import { getHelpInfo, getPkg } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type Command =
  | 'default'
  | 'not_found'
  | 'interactive'

export type CommandOptionsMap = Record<Command, string[]>

export type StrategyMap = Record<
  Command,
  (options: string[]) => void
>

export const ALIAS_MAP = {
  '-h': '--help',
  'i': 'interactive',
  '-v': '--version',
}

export const COMMAND_OPTIONS_MAP: CommandOptionsMap = {
  default: ['--help', '--version'],
  not_found: [],
  interactive: [],
}

export const STRATEGY_MAP: StrategyMap = {
  default: (options) => {
    if (options.includes('--help'))
      getHelpInfo()
    if (options.includes('--version')) {
      console.log(
        pic.inverse(
          pic.bold(pic.white(`v${getPkg().version}`)),
        ),
      )
    }
  },
  not_found: () => {
    console.error(
      pic.inverse(pic.bold(pic.red('Command not found'))),
    )
    getHelpInfo()
  },
  interactive: async () => {
    const spinner = ora()
    try {
      spinner.start('connecting ft pool...')

      rimraf(
        path.resolve(__dirname, '../ft-pool'),
        () => {},
      )
      await $`npx degit zealleaf/ft-pool ft-pool-temp`.quiet()

      const templates: any = await read.json`${path.resolve(
        __dirname,
        '../ft-pool-temp/pool.json',
      )}`

      spinner.succeed('connected!')

      const template = await prt({
        type: 'select',
        name: 'value',
        message: 'Select a template',
        choices: Object.keys(templates).map((k) => {
          return {
            title: pic[templates[k].color as Color](k),
            value: templates[k].url,
          }
        }),
      })
      // TODO
      console.log(template)
    }
    catch (error) {
      spinner.fail('download failed')
      console.error(error)
    }
  },
}
