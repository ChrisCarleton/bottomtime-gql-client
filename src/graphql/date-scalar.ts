import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export default new GraphQLScalarType({
  name: 'Date',

  description: 'Serializes JSON Date types as ISO strings',

  serialize: (value: unknown): string | null => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return null;
  },

  parseValue: (value: unknown): Date | null => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  },

  parseLiteral: (valueNode: ValueNode): Date | null => {
    if (valueNode.kind === Kind.STRING) {
      return new Date(valueNode.value);
    }
    return null;
  },
});
