import {
  getCommandIfExist,
  getFullNameByAliasIfExist,
  getOptions,
} from './utils'

export type Args = string[]

export const args = process.argv.slice(2)

export function handleArgs() {
  const firstArg = args[0] || 'i'

  const cmd = firstArg.startsWith('-')
    ? 'default'
    : firstArg

  const command = getCommandIfExist(
    getFullNameByAliasIfExist(cmd),
  )

  const options = getOptions(command, args)

  return { command, options }
}
