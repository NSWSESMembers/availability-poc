import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { JWT_SECRET } from './config';
import { schedulePerms, eventPerms } from './perms';

// reusable function to check for a user with context
const getAuthenticatedUser = ctx => ctx.user.then((user) => {
  // null means we couldn't find the user record
  if (!user) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('Unauthorized: Invalid user ID');
  }
  return user;
});

const getAuthenticatedDevice = ctx => ctx.device.then((device) => {
  if (!device) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('Unauthorized: Device not found');
  }
  return device;
});

export const getHandlers = ({ models, creators: Creators }) => {
  const {
    Group,
    User,
    Organisation,
    Schedule,
    Event,
    TimeSegment,
  } = models;

  const handlers = {
    device: {
      query(_, args, ctx) {
        return getAuthenticatedDevice(ctx);
      },
      addDevice(user, deviceUuid) {
        return user.getDevices({ where: { uuid: deviceUuid } }).then((existing) => {
          if (existing.length) {
            return existing;
          }
          return Creators.device({
            uuid: deviceUuid,
            user,
          });
        });
      },
      updateDevice(_, args, ctx) {
        const { name, token } = args.device;
        const params = {};
        if (name) {
          params.name = name;
        }
        if (token) {
          params.pushToken = token;
        }
        return getAuthenticatedDevice(ctx).then(device => device.update(params));
      },
      updateLocation(_, args, ctx) {
        return getAuthenticatedDevice(ctx).then((device) => {
          const { locationLat, locationLon } = args.location;
          return device.update({
            locationLat,
            locationLon,
          });
        });
      },
    },

    user: {
      query(_, __, ctx) {
        return getAuthenticatedUser(ctx);
      },
      updateUserProfile(_, args, ctx) {
        // TODO support more basic fields
        const { displayName } = args.user;
        return getAuthenticatedUser(ctx)
          .then(user => user.update({
            displayName,
          }),
          );
      },
      groups(user, args) {
        if (args.id) {
          return user.getGroups({ where: { id: args.id } });
        }
        return user.getGroups({ order: [['id', 'ASC']] });
      },
      events(user) {
        return user.getGroups()
          .then(groups => Event.findAll({
            where: { groupId: groups.map(g => g.id) },
          }));
      },
      schedules(user) {
        return user.getGroups()
          .then(groups => Schedule.findAll({
            where: { groupId: groups.map(g => g.id) },
          }));
      },
      organisation(user) {
        return user.getOrganisation();
      },
      authToken(user) {
        return Promise.resolve(user.authToken);
      },
      devices(user) {
        return user.getDevices();
      },
      tags(user) {
        return user.getTags();
      },
      signup(args, ctx) {
        const { deviceUuid, email, username, password } = args.user;

        const where = {
          $or: [{ email }, { username }],
        };

        return User.findOne({ where })
          .then((existing) => {
            // make sure the username/email don't already exist
            if (existing) {
              return Promise.reject(Error('Username/email already exists'));
            }
            return null;
          })
          .then(
            // hash the user's password
            () => Creators.user({
              username,
              email,
              password,
              version: 1,
              organisation: { id: 1 },
            }),
          )
          .then(
            // now we have the user object we have some stuff to do in parallel
            user =>
              // create a new device with the given UUID
              handlers.device.addDevice(user, deviceUuid)
                .then(() => {
                  // now sign a new JWT to return to the user
                  const { id } = user;
                  const token = jwt.sign(
                    { id, device: deviceUuid, email, version: 1 },
                    JWT_SECRET,
                  );
                  const newUser = user;
                  newUser.authToken = token;

                  // we stuff a Promise that will provide the user into the context
                  // so the User resolver knows that it can provide confidential
                  // info back to the newly-authenticated client
                  ctx.user = Promise.resolve(user);

                  // make sure we return the user to the caller of signup()
                  return newUser;
                }),
          );
      },
      login(args, ctx) {
        const { username, password, deviceUuid } = args.user;

        // we'll call back to this to return the result to the user if their
        // credentials check out.
        const userLoggedIn = user =>
          handlers.device.addDevice(user, deviceUuid).then(() => {
            const token = jwt.sign({
              id: user.id,
              device: deviceUuid,
              email: user.email,
              version: user.version,
            }, JWT_SECRET);

            const newUser = user;
            newUser.authToken = token;

            // we stuff a Promise that will provide the user into the context
            // so the User resolver knows that it can provide confidential
            // info back to the newly-authenticated client
            ctx.user = Promise.resolve(user);

            // make sure we return the user to the caller of login()
            return user;
          });

        return User.findOne({ where: { username } }).then((user) => {
          if (!user) {
            // TODO: for security reasons change this message to something less
            // specific
            return Promise.reject(Error("Username doesn't exist"));
          }

          // TODO: remove this and always verify the password
          if (!password) {
            // for testing we just log the user in if they provide no password
            return userLoggedIn(user);
          }

          return bcrypt.compare(password, user.password).then((res) => {
            if (!res) {
              // TODO: for security reasons change this message to something less
              // specific
              return Promise.reject(Error('Invalid password'));
            }

            return userLoggedIn(user);
          });
        });
      },
    },

    schedule: {
      query(_, args, ctx) {
        // fetch a schedule by ID but ensure the user is allowed to read it
        if (!args.id) {
          return Promise.reject(Error('Must pass ID'));
        }

        // this Promise returns the schedule if the user is allowed to read it
        return schedulePerms.userWantsToRead({
          user: getAuthenticatedUser(ctx),
          schedule: Schedule.findById(args.id),
        });
      },
      timeSegments(schedule) {
        return schedule.getTimesegments();
      },
      group(schedule) {
        return schedule.getGroup();
      },
      createSchedule(_, args) {
        const { name, details, startTime, endTime, groupId } = args.schedule;

        return Group.findById(groupId)
          .then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group'));
            }
            // TODO: check whether the user is a member of the group
            return Creators.schedule({
              name,
              details,
              startTime,
              endTime,
              group,
            });
          });
      },
      messages(event) {
        return event.getMessages();
      },
    },

    timeSegment: {
      user(timesegment) {
        return timesegment.getUser();
      },
      createTimeSegment(_, args, ctx) {
        const { scheduleId, status, startTime, endTime, userId } = args.timeSegment;
        return getAuthenticatedUser(ctx)
          .then(user =>
            Schedule.findById(scheduleId).then((schedule) => {
              if (!schedule) {
                return Promise.reject(Error('Invalid schedule!'));
              }
              return Creators.timeSegment({
                schedule,
                status,
                startTime,
                endTime,
                user: userId === undefined ? user : { id: userId },
              });
            }),
          );
      },
      removeTimeSegment(_, args, ctx) {
        const { segmentId } = args.timeSegment;
        return getAuthenticatedUser(ctx)
          .then(() =>
            TimeSegment.findById(segmentId).then((segment) => {
              if (!segment) {
                return Promise.reject(Error('Invalid segment!'));
              }
              return segment.destroy().then((rows) => {
                if (rows) { return true; }
                return false;
              });
            }),
          );
      },
      updateTimeSegment(_, args, ctx) {
        const { segmentId, status, startTime, endTime } = args.timeSegment;
        return getAuthenticatedUser(ctx)
          .then(() =>
            TimeSegment.findById(segmentId).then((segment) => {
              if (!segment) {
                return Promise.reject(Error('Invalid segment!'));
              }
              return segment.update({
                status,
                startTime,
                endTime,
              });
            }),
          );
      },
    },

    event: {
      query(_, args, ctx) {
        // fetch an event by ID but ensure the user is allowed to read it
        if (!args.id) {
          return Promise.reject(Error('Must pass ID'));
        }

        // this Promise returns the event if the user is allowed to read it
        return eventPerms.userWantsToRead({
          user: getAuthenticatedUser(ctx),
          event: Event.findById(args.id),
        }).then(({ event }) => event);
      },
      group(event) {
        return event.getGroup();
      },
      responses(event) {
        return event.getEventresponses();
      },
      eventLocations(event) {
        return event.getEventlocations();
      },
      setResponse(args, ctx) {
        const {
          id,
        } = args.response;
        return eventPerms.userWantsToWrite({
          user: getAuthenticatedUser(ctx),
          event: Event.findById(id),
        }).then(({ event, user }) => event.getEventresponses({ where: { userId: user.id } })
          .then((result) => {
            const updateArgs = { ...args.response };
            delete updateArgs.id;
            if (typeof (updateArgs.destination) !== 'undefined') { // null is truthy so we need this
              if (updateArgs.destination !== null) {
                return event.getEventlocations({ where: { id: updateArgs.destination.id } })
                  .then((destination) => {
                    if (!destination) {
                      return Promise.reject(Error('Unknown destination passed'));
                    }
                    updateArgs.eventlocationId = destination[0].id;
                    delete updateArgs.destination;
                    if (result.length > 0) {
                      return result[0].update(updateArgs);
                    }
                    return Creators.eventResponse({
                      event,
                      user,
                      destination: destination[0],
                      ...updateArgs,
                    });
                  });
              }
              // destination passed is null
              if (result.length) {
                updateArgs.eventlocationId = null;
                return result[0].update(updateArgs);
              }
              return Creators.eventResponse({
                event,
                user,
                ...updateArgs,
              });
            }
            // no destination passed
            if (result.length) {
              return result[0].update(updateArgs);
            }
            return Creators.eventResponse({
              event,
              user,
              ...updateArgs,
            });
          }));
      },
      messages(event) {
        return event.getMessages();
      },
    },

    eventResponse: {
      user(response) {
        return response.getUser();
      },
      destination(response) {
        return response.getEventlocation();
      },
    },

    organisation: {
      createOrganisation(_, args) {
        const { name } = args.organisation;
        return Creators.organisation({ name });
      },
      groups(org, args) {
        // TODO: think about who we show the complete organisation group list to
        if (args.id) {
          return org.getGroups({ where: { Id: args.id } });
        }
        if (args.filter) {
          return org.getGroups({ where: { name: { [Op.like]: `%${args.filter}%` } }, order: [['id', 'ASC']] });
        }
        return org.getGroups({ order: [['id', 'ASC']] });
      },
      users(org) {
        // TODO: think about who we show the complete organisation user list to
        return org.getUsers({ order: [['id', 'ASC']] });
      },
      tags(org, args) {
        const where = {};
        if (args.nameFilter) {
          where.name = { [Op.like]: `%${args.nameFilter}%` };
        }
        if (args.typeFilter) {
          where.type = { [Op.like]: `%${args.typeFilter}%` };
        }
        return org.getTags({ where, order: [['id', 'ASC']] });
      },
    },

    group: {
      users(group) {
        return group.getUsers({ order: [['displayName', 'ASC']] });
      },
      schedules(group) {
        return group.getSchedules();
      },
      events(group) {
        return group.getEvents();
      },
      createGroup(_, args, ctx) {
        const { name, tags, icon } = args.group;
        return getAuthenticatedUser(ctx)
          .then(user => Organisation.findById(user.organisationId)
            .then(organisation => Creators.group({
              name,
              icon,
              tags,
              users: [user],
              organisation,
            })),
          );
      },
      addUserToGroup(_, args, ctx) {
        const { groupId } = args.groupUpdate;
        return getAuthenticatedUser(ctx).then(user =>
          Group.findById(groupId).then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group!'));
            }
            return user.getGroups({ where: { id: groupId } }).then((existing) => {
              if (existing.length) {
                return Promise.reject(
                  Error(`${user.id} is already a member of ${groupId}!`),
                );
              }
              return group.addUser(user).then(() => group);
            });
          }),
        );
      },
      removeUserFromGroup(_, args, ctx) {
        const { groupId } = args.groupUpdate;
        return getAuthenticatedUser(ctx).then(user =>
          Group.findById(groupId).then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group!'));
            }
            return group.removeUser(user).then((rows) => {
              if (rows) { return group; }
              return false;
            });
          }),
        );
      },
      tags(group) {
        return group.getTags();
      },
      messages(event) {
        return event.getMessages();
      },
    },
    message: {
      user(message) {
        return message.getUser();
      },
      createMessage(_, args, ctx) {
        const { text, eventId, scheduleId, groupId } = args.message;
        return getAuthenticatedUser(ctx).then(user =>
          Creators.message({
            text,
            eventId,
            scheduleId,
            groupId,
            user,
          }),
        );
      },
    },
  };

  return handlers;
};

export default getHandlers;
