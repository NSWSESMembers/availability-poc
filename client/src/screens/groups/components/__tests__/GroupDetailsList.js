import React from 'react';
import renderer from 'react-test-renderer';

import GroupDetailsList from '../GroupDetailsList';


const groupUserItems = [{
  displayName: 'displayName',
  id: 1,
  username: 'username',
  __typename: 'User',
}];

const groupScheduleItems = [{
  details: 'details',
  endTime: 1,
  id: 2,
  name: 'name',
  startTime: 0,
  __typename: 'Schedule',
}];

const groupEventItems = [{
  details: 'details',
  id: 1,
  name: 'name',
  __typename: 'Event',
}];

test('renders correctly', () => {
  const tree = renderer.create(
    <GroupDetailsList
      items={[groupUserItems, groupScheduleItems, groupEventItems]}
      networkStatus={4}
      selectedIndex={1}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer.create(
    <GroupDetailsList
      items={[groupUserItems, groupScheduleItems, groupEventItems]}
      networkStatus={4}
      selectedIndex={2}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <GroupDetailsList
      items={[groupUserItems, groupScheduleItems, groupEventItems]}
      networkStatus={4}
      selectedIndex={3}
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();
});
