# ft <br/> [![npm version](https://img.shields.io/npm/v/@leafvein/ft)](https://www.npmjs.com/package/@leafvein/ft)

> It's easier to fetch a template

## Install

```bash
npm i @leafvein/ft -g
# or
pnpm i @leafvein/ft -g
```

## Usage

```bash
ft <command> [options]
```

### Commands

```bash
i interactive
d direct
```

### Options

```bash
[default]:
  -v, --version  Show version number
  -h, --help     Show help
[direct]
  -r, --repository
  -p, --projectName

```

## Examples

```bash
ft interactive
ft i
ft

ft direct --repository=username/repoName --projectName=demo
ft d -r=username/repoName -p=demo
```

### Template List

[ft-pool](https://github.com/zealleaf/ft-pool)

## License

MIT
