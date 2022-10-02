/* eslint-disable no-console */
import { fileURLToPath } from 'url'
import pic from 'picocolors'
import prt from 'prompts'
import type { Color } from 'ora'
import ora from 'ora'
import { $, path } from 'zx'
import rimraf from 'rimraf'
import { io, read } from 'fsxx'
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
        path.resolve(__dirname, '../ft-pool-temp'),
        () => {},
      )

      await $`npx degit zealleaf/ft-pool ft-pool-temp`.quiet()

      const templates: any = await read.json`${path.resolve(
        __dirname,
        '../ft-pool-temp/pool.json',
      )}`

      spinner.succeed('connected!')

      const res = await prt([
        {
          type: 'select',
          name: 'templateName',
          message: 'Select a template 🕹️',
          choices: Object.keys(templates).map((k) => {
            return {
              title: pic[templates[k].color as Color](k),
              value: templates[k].url,
            }
          }),
        },
        {
          type: 'text',
          name: 'projectName',
          message: 'Please give your new project a name 😊',
        },
      ])

      spinner.start('downloading...')

      await $`npx degit ${res.templateName} ${res.projectName}`.quiet()

      const { data: pkg, save } = await io`${path.resolve(
        __dirname,
        `../${res.projectName}/package.json`,
      )}`

      await save(
        JSON.stringify(
          Object.assign(JSON.parse(pkg), {
            name: '',
            version: '',
            description: '',
            homepage: '',
            bugs: {
              url: '',
            },
            repository: {
              url: '',
            },
          }),
          null,
          2,
        ) as any,
      )

      spinner.succeed(
        `A new project(${res.projectName}) has been created successfully 🎉`,
      )
    }
    catch (error) {
      spinner.fail('download failed')

      console.error(
        pic.inverse(
          pic.bold(
            pic.red(
              '------------------error message-----------------',
            ),
          ),
        ),
      )

      console.error(error)

      console.error(
        pic.inverse(
          pic.bold(
            pic.red(
              '------------------------------------------------',
            ),
          ),
        ),
      )
    }
  },
}
