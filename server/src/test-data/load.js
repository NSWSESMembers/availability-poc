import {
  ORG_NAME, TAGS, USERS, GROUPS, SCHEDULES, EVENTS,
} from './fixtures';
import { DEFAULT_DEVICE_UUID } from '../config';

const createUser = (Creators, organisation, user, allTags) => {
  const { id, username, password, email, displayName, tags } = user;
  const neededTags = tags.map(t => allTags[t] && { id: allTags[t].id });

  return Creators.user({
    id,
    username,
    password,
    email,
    displayName,
    organisation,
    tags: neededTags,
  }).then(u => Creators.device({ uuid: DEFAULT_DEVICE_UUID, user: u })
    .then(() => u));
};

const createUsers = (Creators, organisation, tags) => {
  // create the users from USERS above
  const results = {};
  return Promise.all(
    USERS.map(
      user => createUser(Creators, organisation, user, tags).then((u) => {
        results[u.username] = u;
      }),
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
      t => Creators.tag({ name: t.name, type: t.type, organisation })
        .then((tag) => {
          results[tag.name] = tag;
        }),
    ),
  ).then(() => results);
};

const createSchedule = (Creators, schedule, groups, allTags) => {
  const group = groups[schedule.group];
  const { name, details, type, priority, startTime, endTime, tags } = schedule;
  const neededTags = tags.map(t => allTags[t] && { id: allTags[t].id });
  return Creators.schedule({
    name,
    details,
    type,
    priority,
    startTime,
    endTime,
    group,
    tags: neededTags,
  });
};

const createSchedules = (Creators, groups, tags) => {
  const results = {};
  return Promise.all(
    SCHEDULES.map(schedule => createSchedule(Creators, schedule, groups, tags)
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

const createEventSystemMessage = (Creators, event, message) => {
  const {
    text,
  } = message;
  // lets assume LHQ is the default for now
  return Creators.message({
    text,
    eventId: event.id,
    systemMessage: true,
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
  // lets assume LHQ is the default for now
  const primaryLocation = (name.toLowerCase() === 'lhq');
  return Creators.eventLocation({
    name,
    detail,
    icon,
    locationLatitude,
    locationLongitude,
    primaryLocation,
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
  const {
    name,
    details,
    sourceIdentifier,
    permalink,
    priority,
    responses,
    eventLocations,
    messages,
  } = event;
  return Creators.event({ name, details, sourceIdentifier, permalink, priority, group })
    .then(e => Promise.all([
      createEventLocations(Creators, e, eventLocations).then(em => Promise.all(
        responses.map(r => createEventResponse(Creators, e, r, em, users)),
      )),
      messages.map(m => createEventSystemMessage(Creators, e, m)),
    ]));
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
    const users = await createUsers(Creators, org, tags);
    const groups = await createGroups(Creators, org, users, tags);
    await createSchedules(Creators, groups, tags);
    await createEvents(Creators, groups, users);
  });

export default loadTestData;
