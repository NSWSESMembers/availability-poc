import bcrypt from 'bcrypt';

import { DISTANT_FUTURE } from './constants';

// returns a set of creators bound to the given models
export const getCreators = (models) => {
  const {
    Organisation, Group, User, Tag, Device, Event,
    Schedule, TimeSegment, EventResponse, EventLocation, Message,
  } = models;

  return {
    organisation: ({ name }) =>
      Organisation.create({ name }),

    schedule: ({ name, details, type, priority, startTime, endTime, group }) => {
      if (!group || !group.id) {
        return Promise.reject(Error('Must pass group'));
      }
      if (typeof startTime === 'undefined' || typeof endTime === 'undefined') {
        return Promise.reject(Error('Must pass start and end times'));
      }
      if (endTime < startTime) {
        return Promise.reject(Error('endTime must be greater than startTime'));
      }
      return Schedule.create({
        name,
        details,
        type: type || 'local',
        priority,
        startTime,
        endTime,
        groupId: group.id,
      });
    },

    event: ({ name, details, sourceIdentifier, permalink, priority, group }) => {
      if (!group || !group.id) {
        return Promise.reject(Error('Must pass group'));
      }
      return Event.create({
        name,
        details,
        sourceIdentifier,
        permalink,
        priority,
        groupId: group.id,
        startTime: Math.floor((new Date()).getTime() / 1000),
        endTime: DISTANT_FUTURE, // no end time
      });
    },

    tag: ({ name, type, organisation }) => {
      if (!organisation || !organisation.id) {
        return Promise.reject(Error('Must pass organisation'));
      }
      if (!type) {
        return Promise.reject(Error('Must pass type'));
      }
      return Tag.create({
        name,
        type,
        organisationId: organisation.id,
      });
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

    user: ({ id, username, password, email, displayName, version, organisation, tags }) => {
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
        }).then(user => Promise.all([
          tags && tags.map(
            t => Tag.findById(t.id).then(foundTag => foundTag.addUser(user)),
          ),
        ]).then(() => user.reload()),
        ),
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
      if (endTime < startTime) {
        return Promise.reject(Error('endTime must be greater than startTime'));
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
    eventLocation: ({
      name,
      detail,
      icon,
      locationLatitude,
      locationLongitude,
      locationTime,
      primaryLocation,
      event,
    }) => {
      if (!event || !event.id) {
        return Promise.reject(Error('Must pass event'));
      }
      return EventLocation.create({
        name,
        detail,
        icon,
        locationLatitude,
        locationLongitude,
        locationTime: locationTime || (new Date()).getTime() / 1000,
        eventId: event.id,
      }).then((location) => {
        if (primaryLocation) {
          event.update({ primaryLocationId: location.id });
        }
        return location;
      });
    },
    message: ({ text, image, user, groupId, eventId, scheduleId, systemMessage }) => {
      const futs = [];

      if (!systemMessage && (!user || !user.id)) {
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
        image,
        groupId,
        eventId,
        scheduleId,
        userId: user && user.id,
        edited: false,
      }));
    },
  };
};

export default getCreators;
