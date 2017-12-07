import bcrypt from 'bcrypt';

import {
  Organisation, Group, User, Capability, Tag, Device, Event,
  Schedule, TimeSegment, EventResponse,
} from './models';

const creators = {
  organisation: ({ name }) =>
    Organisation.create({ name }),

  schedule: ({ name, details, startTime, endTime, group }) => {
    if (!group || !group.id) {
      return Promise.reject(Error('Must pass group'));
    }
    if (!startTime || !endTime) {
      return Promise.reject(Error('Must pass start and end times'));
    }
    return Schedule.create({
      name,
      details,
      startTime,
      endTime,
      groupId: group.id,
    });
  },

  event: ({ name, details, group }) => {
    if (!group || !group.id) {
      return Promise.reject(Error('Must pass group'));
    }
    return Event.create({
      name,
      details,
      groupId: group.id,
    });
  },

  tag: ({ name, organisation, user, group }) => {
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    if (!group || !group.id) {
      return Promise.reject(Error('Must pass group'));
    }
    if (!organisation || !organisation.id) {
      return Promise.reject(Error('Must pass organisation'));
    }
    return Tag.create({
      name,
      organisationId: organisation.id,
    }).then(tag => Promise.all([
      tag.addUser(user),
      tag.addGroup(group),
    ]).then(() => tag));
  },

  capability: ({ name, organisation, user }) => {
    if (!organisation || !organisation.id) {
      return Promise.reject(Error('Must pass organisation'));
    }
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    return Capability.create({
      name,
      organisationId: organisation.id,
    }).then(capability =>
      capability.addUser(user)
        .then(() => user),
    );
  },

  device: ({ uuid, user }) => {
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    return Device.create({
      uuid,
      userId: user.id,
    });
  },

  group: ({ organisation, name, user }) => {
    if (!organisation || !organisation.id) {
      return Promise.reject(Error('Must pass organisation'));
    }
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    return Group.create({
      name,
      organisationId: organisation.id,
    }).then(group =>
      group.addUser(user)
        .then(() => group),
    );
  },

  user: ({ id, username, password, email, version, organisation }) => {
    // it's fine for id to be left null/undefined
    if (!organisation || !organisation.id) {
      return Promise.reject(Error('Must pass organisation'));
    }
    return bcrypt.hash(password, 10).then(hash =>
      User.create({
        id,
        username,
        password: hash,
        email,
        version,
        organisationId: organisation.id,
      }),
    );
  },

  timeSegment: ({ status, startTime, endTime, schedule, user }) => {
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    if (!schedule || !schedule.id) {
      return Promise.reject(Error('Must pass schedule'));
    }
    if (!startTime || !endTime) {
      return Promise.reject(Error('Must pass start and end times'));
    }
    return TimeSegment.create({
      status,
      startTime,
      endTime,
      scheduleId: schedule.id,
      userId: user.id,
    });
  },

  eventResponse: ({ status, detail, destination, eta, event, user }) => {
    if (!user || !user.id) {
      return Promise.reject(Error('Must pass user'));
    }
    if (!event || !event.id) {
      return Promise.reject(Error('Must pass event'));
    }
    return EventResponse.create({
      status,
      detail,
      destination,
      eta,
      userId: user.id,
      eventId: event.id,
    });
  },
};

export default creators;
