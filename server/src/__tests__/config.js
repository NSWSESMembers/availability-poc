import { DEFAULT_USER_ID, JWT_SECRET } from '../config';

it('exists', () => {
  expect(DEFAULT_USER_ID).toBeDefined();
  expect(JWT_SECRET).toBeDefined();
});
