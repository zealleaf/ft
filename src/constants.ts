export type Command =
  | 'default'
  | 'not_found'
  | 'interactive'
  | 'direct'

export type CommandOptionsMap = Record<Command, string[]>

export type StrategyMap = Record<
  Command,
  (options: string[]) => void
>

export const ALIAS_MAP = {
  '-h': '--help',
  '-v': '--version',
  '-r': '--repository',
  '-p': '--projectName',
  'i': 'interactive',
  'd': 'direct',
}

export const COMMAND_OPTIONS_MAP: CommandOptionsMap = {
  default: ['--help', '--version'],
  not_found: [],
  interactive: [],
  direct: ['--repository', '--projectName'],
}
