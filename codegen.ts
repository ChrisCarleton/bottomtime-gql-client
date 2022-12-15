import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:5501/api',
  generates: {
    './src/graphql/types.ts': {
      plugins: ['typescript'],
      config: {
        scalars: {
          Date: 'Date',
        },
        enumValues: {
          Role: '../users#UserRole',
        },
      },
    },
  },
};

export default config;
