import type { Runner } from './runner'
import { STRATEGY_MAP } from './strategy'

export const parseFt = <Runner>((command, options) => {
  const fn = STRATEGY_MAP[command]
  fn(options)
})
