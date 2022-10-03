/* eslint-disable no-console */
import pic from 'picocolors'
import prt from 'prompts'
import type { Color } from 'ora'
import ora from 'ora'
import { $, path } from 'zx'
import rimraf from 'rimraf'
import { io, read } from 'fsxx'
import { version } from '../package.json'
import { getErrorInfo, getHelpInfo } from './utils'
import type { StrategyMap } from './constants'

const __cwd = process.cwd()

export const STRATEGY_MAP: StrategyMap = {
  default: async (options) => {
    if (options.includes('--help'))
      getHelpInfo()

    if (options.includes('--version')) {
      console.log(
        pic.inverse(pic.bold(pic.white(`v${version}`))),
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

      await rimraf(
        path.resolve(__cwd, './ft-pool-temp'),
        () => {},
      )

      await $`npx degit zealleaf/ft-pool ft-pool-temp`.quiet()

      const templates: any = await read.json`${path.resolve(
        __cwd,
        './ft-pool-temp/pool.json',
      )}`

      await rimraf(
        path.resolve(__cwd, './ft-pool-temp'),
        () => {},
      )
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
        __cwd,
        `./${res.projectName}/package.json`,
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
      getErrorInfo(error)
    }
  },
  direct: async (options) => {
    const optionsStr = options.join('')
    const spinner = ora()
    if (
      optionsStr.includes('--repository')
      && optionsStr.includes('--projectName')
    ) {
      try {
        const optionObj = {
          repository: '',
          projectName: '',
        }
        for (const option of options) {
          const [key, value] = option.split('=')
          if (
            optionObj[
              key.slice(2) as keyof typeof optionObj
            ] !== undefined
          ) {
            optionObj[
              key.slice(2) as keyof typeof optionObj
            ] = value
          }
        }
        spinner.start('fetching template...')
        await $`degit ${optionObj.repository} ${optionObj.projectName}`.quiet()
        spinner.succeed('successfully 🎉')
      }
      catch (error) {
        spinner.fail('failed')
        getErrorInfo(error)
      }
    }
    else {
      getHelpInfo()
    }
  },
}
