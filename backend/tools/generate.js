const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
  {
    option: 'Create Module',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/module/',
    },
    stringReplacers: ['__module__'],
    output: {
      path: './src/modules/__module__(lowerCase)',
      pathAndFileNameDefaultCase: '(lowerCase)',
      overwrite: true,
    },
  },
  {
    option: 'Entity',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/__entity__.entity.ts',
    },
    stringReplacers: ['__entity__'],
    output: {
      path: './src/entities/__entity__(lowerCase).entity.ts',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
  },
  {
    option: 'Repository',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/__repository__.repository.ts',
    },
    stringReplacers: ['__repository__'],
    output: {
      path: './src/repositories/__repository__(lowerCase).repository.ts',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
  },
]);
