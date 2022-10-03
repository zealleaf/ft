import pic from 'picocolors'
import { ALIAS_MAP, COMMAND_OPTIONS_MAP } from './constants'

export function getFullNameByAliasIfExist(s: string) {
  return Object.keys(ALIAS_MAP).includes(s)
    ? ALIAS_MAP[s as keyof typeof ALIAS_MAP]
    : s
}

export function getCommandIfExist(s: string) {
  return Object.keys(COMMAND_OPTIONS_MAP).includes(s)
    ? s
    : 'not_found'
}

function getSpecifiedOptionsByCommand(command: string) {
  return (
    COMMAND_OPTIONS_MAP[
      command as keyof typeof COMMAND_OPTIONS_MAP
    ] || []
  )
}

export function getOptions(
  command: string,
  args: string[],
) {
  const options = args
    .map((arg) => {
      const [n1, n2] = arg?.split('=')
      const fullName = getFullNameByAliasIfExist(n1)
      const specifiedOptions
        = getSpecifiedOptionsByCommand(command)
      if (specifiedOptions.includes(fullName)) {
        if (n2)
          return `${fullName}=${n2}`
        else return fullName
      }
      else {
        return undefined
      }
    })
    .filter(o => o)
  return options
}

export function getHelpInfo() {
  // eslint-disable-next-line no-console
  console.log(`
Usage: ft <command> [options]

Commands:
  i interactive  
  d direct

Options: 
[default]:
  -v, --version  Show version number
  -h, --help     Show help
[direct]
  -r, --repository
  -p, --projectName

Examples:
  ft interactive
  ft i
  ft

  ft direct --repository=username/repoName --projectName=demo
  ft d -r=username/repoName -p=demo
 `)
}

export function getErrorInfo(error: any) {
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
