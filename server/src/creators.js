import bcrypt from 'bcrypt';

import {
  Organisation, Group, User, Capability, Tag, Device, Event,
  Schedule, TimeSegment,
} from './models';

const creators = {
  organisation: ({ name }) =>
    Organisation.create({ name }),

  schedule: ({ name, details, group }) => {
    if (!group) {
      return Promise.reject(Error('Must pass group'));
    }
    return Schedule.create({
      name,
      details,
      groupId: group.id,
    });
  },

  event: ({ name, details, group }) => {
    if (!group) {
      return Promise.reject(Error('Must pass group'));
    }
    return Event.create({
      name,
      details,
      groupId: group.id,
    });
  },

  tag: ({ name, organisation, user, group }) => {
    if (!user) {
      return Promise.reject(Error('Must pass user'));
    }
    if (!group) {
      return Promise.reject(Error('Must pass group'));
    }
    if (!organisation) {
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
    if (!organisation) {
      return Promise.reject(Error('Must pass organisation'));
    }
    if (!user) {
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
    if (!user) {
      return Promise.reject(Error('Must pass user'));
    }
    return Device.create({
      uuid,
      userId: user.id,
    });
  },

  group: ({ organisation, name, user }) => {
    if (!organisation) {
      return Promise.reject(Error('Must pass organisation'));
    }
    if (!user) {
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
    if (!organisation) {
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

  timeSegment: ({ startTime, endTime, schedule, user }) => {
    if (!user) {
      return Promise.reject(Error('Must pass user'));
    }
    if (!user) {
      return Promise.reject(Error('Must pass schedule'));
    }
    return TimeSegment.create({
      startTime,
      endTime,
      userId: user.id,
      scheduleId: schedule.id,
    });
  },
};

export default creators;
