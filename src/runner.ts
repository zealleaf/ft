import type { Command } from './strategy'
import { handleArgs } from './args'

export type Runner = (
  command: Command,
  options: string[]
) => Promise<Command> | Command

export async function beginRun(fn: Runner) {
  try {
    const { command, options } = handleArgs()
    await running(
      fn,
      command as Command,
      options as string[],
    )
  }
  catch (error) {
    process.exit(1)
  }
}

export async function running(
  fn: Runner,
  command: Command,
  options: string[],
) {
  try {
    fn(command, options)
  }
  catch (error) {
    process.exit(1)
  }
}
