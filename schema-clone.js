const fs = require('fs/promises');
const { printSchema } = require('graphql');

module.exports = {
  async plugin(schema, _documents, config) {
    const filename = config.typedefsOutFile ?? './schema.graphql';
    await fs.writeFile(filename, printSchema(schema), 'utf-8');
  },
};
