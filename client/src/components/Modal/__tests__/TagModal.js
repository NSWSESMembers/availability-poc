import React from 'react';
import renderer from 'react-test-renderer';

import TagModal from '../TagModal';

const noop = () => {};

test('renders correctly', () => {
  const normal = renderer.create(
    <TagModal
      headerText="test"
      dataIn={[{ name: 'item1', id: 0 }]}
      selectedTags={[]}
      onSelect={noop}
      closeModal={noop}
      backModal={noop}
      onSearch={noop}
      isLoading={false}
      visible
    />,
  ).toJSON();
  const selection = renderer.create(
    <TagModal
      headerText="test"
      dataIn={[{ name: 'item1', id: 0 }]}
      selectedTags={[0]}
      onSelect={noop}
      closeModal={noop}
      backModal={noop}
      onSearch={noop}
      isLoading={false}
      visible
    />,
  ).toJSON();
  const loading = renderer.create(
    <TagModal
      headerText="test"
      dataIn={[{ name: 'item1', id: 0 }]}
      selectedTags={[]}
      onSelect={noop}
      closeModal={noop}
      backModal={noop}
      onSearch={noop}
      isLoading
      visible
    />,
  ).toJSON();
  const empty = renderer.create(
    <TagModal
      headerText="test"
      dataIn={[]}
      selectedTags={[]}
      onSelect={noop}
      closeModal={noop}
      backModal={noop}
      onSearch={noop}
      isLoading
      visible
    />,
  ).toJSON();
  expect(normal).toMatchSnapshot();
  expect(selection).toMatchSnapshot();
  expect(loading).toMatchSnapshot();
  expect(empty).toMatchSnapshot();
});
