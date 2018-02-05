import {
  ORG_NAME, CAPABILITIES, TAGS, USERS, GROUPS, SCHEDULES, EVENTS, DEFAULT_USERNAME, DEFAULT_GROUP,
} from './fixtures';
import { DEFAULT_DEVICE_UUID } from '../config';

const createUser = (Creators, organisation, user) => {
  const { id, username, password, email } = user;
  return Creators.user({
    id,
    username,
    password,
    email,
    organisation,
  }).then(u => Creators.device({ uuid: DEFAULT_DEVICE_UUID, user: u })
    .then(() => u));
};

const createUsers = (Creators, organisation) => {
  // create the users from USERS above
  const results = {};
  return Promise.all(
    USERS.map(
      user => createUser(Creators, organisation, user).then((u) => { results[u.username] = u; }),
    ),
  ).then(() => results);
};

const createGroup = (Creators, organisation, group, userObjects) => {
  // gather the created user objects we want to add to this group
  const users = group.users.map(username => userObjects[username]);
  const { name } = group;
  return Creators.group({ organisation, name, users });
};

const createGroups = (Creators, organisation, users) => {
  // create the groups from GROUPS above
  const results = {};
  return Promise.all(
    GROUPS.map(
      group => createGroup(Creators, organisation, group, users)
        .then((g) => { results[g.name] = g; }),
    ),
  ).then(() => results);
};

const createTags = (Creators, organisation, user, group) => {
  // create the tags and then return the created objects in a dict keyed by their name
  // For now we assign all tags to the single provided user and group
  const results = {};
  return Promise.all(
    TAGS.map(
      t => Creators.tag({ name: t, organisation, user, group })
        .then((tag) => {
          results[tag.name] = tag;
        }),
    ),
  ).then(() => results);
};

const createCapabilities = (Creators, organisation, user) => {
  // create the capabilities and then return the created objects in a dict keyed by their name
  // For now we assign all capabilities to the single provided user
  const results = {};
  return Promise.all(
    CAPABILITIES.map(c => Creators.capability({ name: c, organisation, user })
      .then((capability) => {
        results[capability.name] = capability;
      }),
    ),
  ).then(() => results);
};

const createSchedule = (Creators, schedule, groups) => {
  const group = groups[schedule.group];
  const { name, details, startTime, endTime } = schedule;
  return Creators.schedule({ name, details, startTime, endTime, group });
};

const createSchedules = (Creators, groups) => {
  const results = {};
  return Promise.all(
    SCHEDULES.map(schedule => createSchedule(Creators, schedule, groups)
      .then((s) => {
        results[s.name] = s;
      })),
  );
};

const createEventResponse = (Creators, event, response, users) => {
  const user = users[response.user];
  const { status, detail, destination, eta } = response;
  return Creators.eventResponse({ status, detail, destination, eta, event, user });
};

const createEvent = (Creators, event, groups, users) => {
  // create an event from EVENTS. Add each event response as well.
  const group = groups[event.group];
  const { name, details, responses } = event;
  return Creators.event({ name, details, group })
    .then(e => Promise.all(
      responses.map(r => createEventResponse(Creators, e, r, users)),
    ));
};

const createEvents = (Creators, groups, users) =>
  // create the events in EVENTS including responses
  Promise.all(
    EVENTS.map(event => createEvent(Creators, event, groups, users)),
  );

export const loadTestData = Creators =>
  Creators.organisation({
    name: ORG_NAME,
  }).then(async (org) => {
    const users = await createUsers(Creators, org);
    const groups = await createGroups(Creators, org, users);
    const testUser = users[DEFAULT_USERNAME];
    const testGroup = groups[DEFAULT_GROUP];
    await createTags(Creators, org, testUser, testGroup);
    await createCapabilities(Creators, org, testUser);
    await createSchedules(Creators, groups, users);
    await createEvents(Creators, groups, users);
  });

export default loadTestData;
