import React from 'react';
import TestRenderer from 'react-test-renderer';

import HomeList from '../HomeList';

const user = {
  id: 1,
  username: 'username',
  schedules: [
    {
      id: 1,
      name: 'schedule name',
      details: 'schedule details',
      startTime: 1524460714,
      endTime: 1524460714 + (60 * 60 * 24),
    },
  ],
  events: [
    {
      id: 1,
      name: 'event name',
      details: 'event details',
    },
  ],
};

test('renders correctly', () => {
  const tree1 = TestRenderer.create(
    <HomeList
      onRefresh={jest.fn()}
      modalNavigation={{ push: jest.fn() }}
      homeNavigation={{ push: jest.fn() }}
      user={user}
      refreshing={false}
    />,
  ).toJSON();
  expect(tree1).toMatchSnapshot();
});

test('onPressEvent', () => {
  const event = user.events[0];
  const homeNavigationPush = jest.fn();

  const renderer = TestRenderer.create(
    <HomeList
      onRefresh={jest.fn()}
      modalNavigation={{ push: jest.fn() }}
      homeNavigation={{ push: homeNavigationPush }}
      user={user}
      refreshing={false}
    />,
  );

  renderer.getInstance().onPressEvent(event);

  expect(homeNavigationPush.mock.calls.length).toBe(1);
  expect(homeNavigationPush.mock.calls[0][1].eventId).toEqual(event.id);
});

test('onPressNewEvent', () => {
  const event = user.events[0];
  const modalNavigationPush = jest.fn();

  const renderer = TestRenderer.create(
    <HomeList
      onRefresh={jest.fn()}
      modalNavigation={{ push: modalNavigationPush }}
      homeNavigation={{ push: jest.fn() }}
      user={user}
      refreshing={false}
    />,
  );

  renderer.getInstance().onPressNewEvent(event);

  expect(modalNavigationPush.mock.calls.length).toBe(1);
  expect(modalNavigationPush.mock.calls[0][1].eventId).toEqual(event.id);
});

test('onPressSchedule', () => {
  const schedule = user.schedules[0];
  const homeNavigationPush = jest.fn();

  const renderer = TestRenderer.create(
    <HomeList
      onRefresh={jest.fn()}
      modalNavigation={{ push: jest.fn() }}
      homeNavigation={{ push: homeNavigationPush }}
      user={user}
      refreshing={false}
    />,
  );

  renderer.getInstance().onPressSchedule(schedule);

  expect(homeNavigationPush.mock.calls.length).toBe(1);
  expect(homeNavigationPush.mock.calls[0][1].id).toEqual(schedule.id);
});
