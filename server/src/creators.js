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
    return Schedule.create({ name, details }).then(schedule =>
      schedule.setGroup(group),
    );
  },

  event: ({ name, details, group }) => {
    if (!group) {
      return Promise.reject(Error('Must pass group'));
    }
    return Event.create({ name, details, group }).then(event =>
      event.setGroup(group),
    );
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
      organisation,
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
      organisation,
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
      user,
    });
  },

  group: ({ name, user }) => {
    if (!user) {
      return Promise.reject(Error('Must pass user'));
    }
    return Group.create({
      name,
    }).then(group =>
      group.addUser(user)
        .then(() => group),
    );
  },

  user: ({ id, username, password, email, version, organisation }) => {
    if (!organisation) {
      return Promise.reject(Error('Must pass organisation'));
    }
    return bcrypt.hash(password, 10).then(hash =>
      User.create({
        id, username, password: hash, email, version,
      }).then(user => user.setOrganisation(organisation)),
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
    }).then(ts => Promise.all([
      ts.setUser(user),
      ts.setSchedule(schedule),
    ]));
  },
};

export default creators;
