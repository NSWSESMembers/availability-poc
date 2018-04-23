import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from '../ListItem';

const noop = () => {};

test('renders correctly', () => {
  const tree = renderer.create(
    <ListItem
      title="Title"
      titleNumberOfLines={2}
      subtitle="Subtitle"
      subtitleNumberOfLines={3}
      detail="Detail"
      iconRight="glass"
      iconLeft="music"
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
