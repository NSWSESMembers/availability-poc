import React from 'react';
import renderer from 'react-test-renderer';

import DateSelect from '../DateSelect';

const noop = () => {};

test('renders correctly', () => {
  const tree = renderer.create(
    <DateSelect
      key="1"
      availType="OUT_OF_RANGE"
      day={1}
      onSelect={noop}
      select
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer.create(
    <DateSelect
      key="1"
      availType="NotSpecified"
      day={1}
      onSelect={noop}
      select
    />,
  ).toJSON();
  expect(tree2).toMatchSnapshot();

  const tree3 = renderer.create(
    <DateSelect
      key="1"
      availType="AVAILABLE"
      day={1}
      onSelect={noop}
      select
    />,
  ).toJSON();
  expect(tree3).toMatchSnapshot();

  const tree4 = renderer.create(
    <DateSelect
      key="1"
      availType="UNAVAILABLE"
      day={1}
      onSelect={noop}
      select
    />,
  ).toJSON();
  expect(tree4).toMatchSnapshot();

  const tree5 = renderer.create(
    <DateSelect
      key="1"
      availType="URGENT"
      day={1}
      onSelect={noop}
      select
    />,
  ).toJSON();
  expect(tree5).toMatchSnapshot();
});
