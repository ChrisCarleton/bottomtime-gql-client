import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:5501/api',
  generates: {
    './src/graphql/types.ts': {
      plugins: ['typescript', 'typescript-resolvers', './schema-clone.js'],
      config: {
        scalars: {
          Date: 'string',
        },
        enumValues: {
          Role: '../users#UserRole',
        },
        typedefsOutFile: './test/schema.graphql',
      },
    },
  },
};

export default config;
