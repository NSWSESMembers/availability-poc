import { getSchema } from '../schema';

const resolvers = {};

it('compiles', () => {
  const result = getSchema(resolvers);
  expect(result).toBeDefined();
});
