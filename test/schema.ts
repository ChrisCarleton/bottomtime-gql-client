import { readFile } from 'fs/promises';
import { resolve } from 'path';

let typeDefs: string;

global.beforeAll(async () => {
  typeDefs = await readFile(resolve(__dirname, './schema.graphql'), 'utf-8');
});

export { typeDefs };
