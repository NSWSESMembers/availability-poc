import React from 'react';
import renderer from 'react-test-renderer';

import GroupDetailsHeader from '../GroupDetailsHeader';

const noop = () => {};

test('renders correctly', () => {
  const tree = renderer.create(
    <GroupDetailsHeader
      groupIcon="fa-group"
      groupName="groupName"
      tags="tags"
      memberAlready
      leaveGroup={noop}
      joinGroup={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer.create(
    <GroupDetailsHeader
      groupIcon="fa-group"
      groupName="groupName"
      tags=""
      memberAlready
      leaveGroup={noop}
      joinGroup={noop}
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <GroupDetailsHeader
      groupIcon="fa-group"
      groupName="groupName"
      tags="tags"
      memberAlready={false}
      leaveGroup={noop}
      joinGroup={noop}
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();
});
