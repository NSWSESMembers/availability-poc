import { getMapDelta } from '../mapDelta';

test('mapDelta', () => {
  expect(
    getMapDelta(0, 0, 1),
  ).toMatchSnapshot();
});
