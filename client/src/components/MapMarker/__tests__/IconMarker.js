import React from 'react';
import renderer from 'react-test-renderer';

import IconMarker from '../IconMarker';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <IconMarker
      name="bullhorn"
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
