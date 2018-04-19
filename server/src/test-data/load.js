import {
  ORG_NAME, CAPABILITIES, TAGS, USERS, GROUPS, SCHEDULES, EVENTS, DEFAULT_USERNAME,
} from './fixtures';
import { DEFAULT_DEVICE_UUID } from '../config';

const createUser = (Creators, organisation, user) => {
  const { id, username, password, email, displayName } = user;
  return Creators.user({
    id,
    username,
    password,
    email,
    displayName,
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

const createGroup = (Creators, organisation, group, userObjects, allTags) => {
  // gather the created user objects we want to add to this group
  const users = group.users.map(username => userObjects[username]);
  const { name, icon, tags } = group;
  const neededTags = tags.map(t => allTags[t] && { id: allTags[t].id });
  return Creators.group({ organisation, name, icon, users, tags: neededTags });
};

const createGroups = (Creators, organisation, users, tags) => {
  // create the groups from GROUPS above
  const results = {};
  return Promise.all(
    GROUPS.map(
      group => createGroup(Creators, organisation, group, users, tags)
        .then((g) => { results[g.name] = g; }),
    ),
  ).then(() => results);
};

const createTags = (Creators, organisation) => {
  // create the tags and then return the created objects in a dict keyed by their name
  // For now we assign all tags to the single provided user and group
  const results = {};
  return Promise.all(
    TAGS.map(
      t => Creators.tag({ name: t, organisation })
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

const createEventResponse = (Creators, event, response, markers, users) => {
  const user = users[response.user];
  const marker = markers[response.destination];
  const {
    status,
    detail,
    eta,
    locationLatitude,
    locationLongitude,
    locationTime,
  } = response;

  return Creators.eventResponse({
    status,
    detail,
    destination: marker,
    eta,
    locationLatitude,
    locationLongitude,
    locationTime,
    event,
    user,
  });
};

const createEventLocation = (Creators, event, location) => {
  const {
    name,
    detail,
    icon,
    locationLatitude,
    locationLongitude,
  } = location;
  return Creators.eventLocation({
    name,
    detail,
    icon,
    locationLatitude,
    locationLongitude,
    event,
  });
};

const createEventLocations = (Creators, event, locations) => {
  const results = {};
  return Promise.all(
    locations.map(location => createEventLocation(Creators, event, location)
      .then((s) => {
        results[s.name] = s;
      })),
  ).then(() => results);
};

const createEvent = (Creators, event, groups, users) => {
  // create an event from EVENTS. Add each event response as well.
  const group = groups[event.group];
  const { name, details, sourceIdentifier, permalink, responses, eventLocations } = event;
  return Creators.event({ name, details, sourceIdentifier, permalink, group })
    .then((e) => {
      createEventLocations(Creators, e, eventLocations).then((em) => {
        Promise.all(
          responses.map(r => createEventResponse(Creators, e, r, em, users)),
        );
      });
    });
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
    const tags = await createTags(Creators, org);
    const users = await createUsers(Creators, org);
    const groups = await createGroups(Creators, org, users, tags);
    const testUser = users[DEFAULT_USERNAME];
    await createCapabilities(Creators, org, testUser);
    await createSchedules(Creators, groups, users);
    await createEvents(Creators, groups, users);
  });

export default loadTestData;
