import bcrypt from 'bcrypt';

import { DISTANT_FUTURE } from './constants';

// returns a set of creators bound to the given models
export const getCreators = (models) => {
  const {
    Organisation, Group, User, Capability, Tag, Device, Event,
    Schedule, TimeSegment, EventResponse, EventLocation, Message,
  } = models;

  return {
    organisation: ({ name }) =>
      Organisation.create({ name }),

    schedule: ({ name, details, startTime, endTime, group }) => {
      if (!group || !group.id) {
        return Promise.reject(Error('Must pass group'));
      }
      if (typeof startTime === 'undefined' || typeof endTime === 'undefined') {
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

    event: ({ name, details, sourceIdentifier, permalink, group, location }) => {
      if (!group || !group.id) {
        return Promise.reject(Error('Must pass group'));
      }
      return Event.create({
        name,
        details,
        sourceIdentifier,
        permalink,
        location,
        groupId: group.id,
        startTime: (new Date()).getTime() / 1000,
        endTime: DISTANT_FUTURE, // no end time
      });
    },

    location: ({ name, detail, locationLatitude, locationLongitude }) => EventLocation.create({
      name,
      detail,
      locationLatitude,
      locationLongitude,
    }),

    tag: ({ name, organisation }) => {
      if (!organisation || !organisation.id) {
        return Promise.reject(Error('Must pass organisation'));
      }
      return Tag.create({
        name,
        organisationId: organisation.id,
      });
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

    group: ({ organisation, name, icon, tags, users }) => {
      if (!organisation || !organisation.id) {
        return Promise.reject(Error('Must pass organisation'));
      }
      if (!users || users.length === 0) {
        return Promise.reject(Error('Must pass at least one user'));
      }
      return Group.create({
        name,
        icon: icon || 'group',
        organisationId: organisation.id,
      }).then(group => Promise.all([
        group.addUsers(users),
        tags && tags.map(
          t => Tag.findById(t.id).then(foundTag => foundTag.addGroup(group)),
        ),
      ]).then(() => group.reload()));
    },

    user: ({ id, username, password, email, displayName, version, organisation }) => {
      // it's fine for id to be left null/undefined
      if (!organisation || !organisation.id) {
        return Promise.reject(Error('Must pass organisation'));
      }
      return bcrypt.hash(password, 10).then(hash =>
        User.create({
          id,
          username,
          password: hash,
          displayName: displayName || username,
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
      if (typeof startTime === 'undefined' || typeof endTime === 'undefined') {
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

    eventResponse: ({
      status,
      detail,
      destination,
      eta,
      locationLatitude,
      locationLongitude,
      locationTime,
      event,
      user,
    }) => {
      if (!user || !user.id) {
        return Promise.reject(Error('Must pass user'));
      }
      if (!event || !event.id) {
        return Promise.reject(Error('Must pass event'));
      }
      return EventResponse.create({
        status,
        detail: detail || '',
        eta: eta || 0,
        locationLatitude,
        locationLongitude,
        locationTime,
        userId: user.id,
        eventId: event.id,
        eventlocationId: (destination ? destination.id : null),
      });
    },
    eventLocation: ({ name, detail, icon, locationLatitude, locationLongitude, event }) => {
      if (!event || !event.id) {
        return Promise.reject(Error('Must pass event'));
      }
      return EventLocation.create({
        name,
        detail,
        icon,
        locationLatitude,
        locationLongitude,
        eventId: event.id,
      });
    },
    message: ({ text, user, groupId, eventId, scheduleId }) => {
      const futs = [];

      if (!user || !user.id) {
        return Promise.reject(Error('Must pass user'));
      }

      if (groupId) {
        futs.push(Group.findById(groupId).then((group) => {
          if (!group) {
            return Promise.reject(Error('Must pass valid group ID'));
          }
          return group;
        }));
      }
      if (eventId) {
        futs.push(Event.findById(eventId).then((event) => {
          if (!event) {
            return Promise.reject(Error('Must pass valid event ID'));
          }
          return event;
        }));
      }
      if (scheduleId) {
        futs.push(Schedule.findById(scheduleId).then((schedule) => {
          if (!schedule) {
            return Promise.reject(Error('Must pass valid schedule ID'));
          }
          return schedule;
        }));
      }

      if (futs.length !== 1) {
        return Promise.reject(Error('must pass exactly one of groupId, eventId, scheduleId'));
      }

      return Promise.all(futs).then(() => Message.create({
        text,
        groupId,
        eventId,
        scheduleId,
        userId: user.id,
        edited: false,
      }));
    },
  };
};

export default getCreators;
