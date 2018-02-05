import { DISTANT_PAST, DISTANT_FUTURE } from '../constants';

it('times are sane', () => {
  const now = new Date();
  const ts = now.getTime() / 1000;
  expect(DISTANT_PAST).toBeLessThan(ts);
  expect(DISTANT_FUTURE).toBeGreaterThan(ts);
});
