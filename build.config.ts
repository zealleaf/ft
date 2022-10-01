import { defineBuildConfig } from 'unbuild'
import { fg } from 'fsxx'
export default defineBuildConfig({
  entries: [
    ...fg
      .sync('src/commands/*.ts')
      .map(s => s.slice(0, -3)),
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
