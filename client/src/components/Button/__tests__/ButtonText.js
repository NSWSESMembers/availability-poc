import React from 'react';
import renderer from 'react-test-renderer';

import ButtonText from '../ButtonText';

test('renders correctly', () => {
  const tree1 = renderer.create(
    <ButtonText
      title="title"
      description="description"
      icon
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});
