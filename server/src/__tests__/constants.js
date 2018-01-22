import { distantFuture, nowInUTC } from '../constants';

it('exists', () => {
  expect(distantFuture).toBeDefined();
  expect(nowInUTC).toBeDefined();
});

it('nowInUTC returns a number', () =>
  expect(nowInUTC()).toBeGreaterThan(0),
);

it('distantFuture returns a number', () =>
  expect(distantFuture).toEqual(2147483647),
);
