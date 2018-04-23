import React from 'react';
import renderer from 'react-test-renderer';

import EventListItem from '../EventListItem';

const noop = () => {};

test('renders correctly', () => {
  const event = {
    id: 1,
    name: 'Name',
    details: 'Details',
  };
  const tree = renderer.create(
    <EventListItem
      event={event}
      onPress={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
