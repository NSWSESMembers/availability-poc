import React from 'react';
import TestRenderer from 'react-test-renderer';

import Menu from '../Menu';

test('renders correctly', () => {
  const noop = jest.fn();
  const tree = TestRenderer.create(
    <Menu
      onShowUserProfile={noop}
      onUpdateLocation={noop}
      onCheckForUpdate={noop}
      onSubmitFeedback={noop}
      onTestBugsnag={noop}
      onShowParams={noop}
      onSendTestPush={noop}
      onLogout={noop}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
