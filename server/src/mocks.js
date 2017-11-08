import faker from 'faker';
import { MockList } from 'graphql-tools';

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function chooseResponse() {
  return choice(['responding', 'unavailable', 'tentative']);
}

function chooseStatus() {
  return choice(['available', 'unavailable']);
}

export const Mocks = {
  Date: () => new Date(),
  Int: () => parseInt(Math.random() * 100, 10),
  // String: () => 'It works!!!',
  Query: () => ({
    user: (root, args) => ({
      email: 'you@ses.nsw.gov.au',
      username: 'thisisme',
    }),
  }),
  Organisation: () => ({
    id: 69,
    name: 'NSW SES',
    groups: () => new MockList([2, 3]),
    users: () => new MockList([2, 5]),
  }),
  User: () => ({
    email: faker.internet.email(),
    username: faker.internet.userName(),
  }),
  Device: () => ({
    uuid: '0000000-0000000-000',
    authToken: 'kliypoip3o4tpoiahsdgf9p83t',
    pushToken: 'o8asdg98sdfgofgkjfg',
    location: '37.484911, -122.148230',
    locationTimestamp: Math.round((new Date()).getTime() / 1000),
  }),
  Group: () => ({
    name: faker.lorem.words(Math.random() * 3),
    users: () => new MockList([1, 3]),
    schedules: () => new MockList([2, 3]),
    events: () => new MockList([2, 3]),
  }),
  Event: () => ({
    details: faker.lorem.words(Math.random() * 3),
    responses: () => new MockList([3, 5]),
  }),
  EventResponse: () => ({
    status: chooseResponse(),
    detail: '30 mins away',
  }),
  Schedule: () => ({
    name: faker.lorem.words(Math.random() * 3),
    timeSegments: () => new MockList([2, 5]),
  }),
  TimeSegment: () => ({
    status: chooseStatus(),
    startTime: Math.round(((new Date()).getTime() / 1000) + (60 * 60 * 24)),
    endTime: Math.round(((new Date()).getTime() / 1000) + (60 * 60 * 24 * 2)),
  })
};



export default Mocks;
