import { setupLogger } from '../logger';


it('compiles', () => {
  const result = setupLogger();
  expect(result).toBeDefined();
});
