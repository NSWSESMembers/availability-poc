import { isLoggedIn } from '../auth';

test('isLoggedIn', () => {
  expect(isLoggedIn({ username: 'Test' })).toEqual(true);
  expect(isLoggedIn({})).toEqual(false);
});
