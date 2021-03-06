import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { withFilter } from 'graphql-subscriptions';
import { PUBSUBS } from './constants';

import { JWT_SECRET } from './config';
import { schedulePerms, eventPerms } from './perms';

// reusable function to check for a user with context
const getAuthenticatedUser = ctx =>
  ctx.user.then((user) => {
    // null means we couldn't find the user record
    if (!user) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('Unauthorized: Invalid user ID');
    }
    return user;
  });

const getAuthenticatedDevice = ctx =>
  ctx.device.then((device) => {
    if (!device) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('Unauthorized: Device not found');
    }
    return device;
  });

const areEventNotificationsEnableForUser = (event, user) =>
  event.getUsersWithEventNotificationEnabled(
    { where: { id: user.id } },
  ).then(result => !!result.length);

export const getHandlers = ({ logWriter, models, creators: Creators, push, pubsub }) => {
  const { Group, User, Organisation, Schedule, Event, TimeSegment, EventLocation, Tag } = models;

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
        return getAuthenticatedDevice(ctx).then(device => device.update(params).then((res) => {
          logWriter({
            source: device.uuid,
            action: 'updateDevice',
            payload: args.device,
          });
          return res;
        }));
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
        return getAuthenticatedUser(ctx).then(user => user.update({
          displayName,
        }).then((res) => {
          logWriter({
            source: user.username,
            action: 'updateUserProfile',
            payload: args.user,
          });
          return res;
        }));
      },
      groups(user, args) {
        if (args.id) {
          return user.getGroups({ where: { id: args.id } });
        }
        return user.getGroups({ order: [['id', 'ASC']] });
      },
      events(user) {
        return user.getGroups().then(groups =>
          Event.findAll({
            where: { groupId: groups.map(g => g.id) },
          }),
        );
      },
      schedules(user) {
        return user.getGroups().then(groups =>
          Schedule.findAll({
            where: { groupId: groups.map(g => g.id) },
          }),
        );
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
            () =>
              Creators.user({
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
              handlers.device.addDevice(user, deviceUuid).then(() => {
                // now sign a new JWT to return to the user
                const { id } = user;
                const token = jwt.sign({ id, device: deviceUuid, email, version: 1 }, JWT_SECRET);
                const newUser = user;
                newUser.authToken = token;

                // we stuff a Promise that will provide the user into the context
                // so the User resolver knows that it can provide confidential
                // info back to the newly-authenticated client
                ctx.user = Promise.resolve(user);

                // redact password
                logWriter({
                  source: user.username,
                  action: 'signup',
                  payload: { ...args.user, password: '' },
                });

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
            const token = jwt.sign(
              {
                id: user.id,
                device: deviceUuid,
                email: user.email,
                version: user.version,
              },
              JWT_SECRET,
            );

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
      timeSegments(schedule, args) {
        if (!args.userIdFilter) {
          return schedule.getTimesegments();
        }
        return schedule.getTimesegments({ where: { userId: args.userIdFilter } });
      },
      group(schedule) {
        return schedule.getGroup();
      },
      createSchedule(_, args, ctx) {
        const { name, details, type, priority, startTime, endTime, groupId, tags } = args.schedule;
        getAuthenticatedUser(ctx).then(user => Group.findById(groupId)
          .then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group'));
            }
            // TODO: check whether the user is a member of the group
            return Creators.schedule({
              name,
              details,
              type,
              priority,
              startTime,
              endTime,
              group,
              tags,
            }).then((schedule) => {
              logWriter({
                source: user.username,
                action: 'createSchedule',
                payload: schedule,
              });
              push.pushScheduleToGroup(schedule);
              return schedule;
            });
          }));
      },
      updateSchedule(_, args, ctx) {
        const {
          id, name, details, type, priority,
          startTime, endTime, groupId, tags,
        } = args.schedule;
        return getAuthenticatedUser(ctx).then(() =>
          Schedule.findById(id).then((schedule) => {
            if (!schedule) {
              return Promise.reject(Error('Invalid schedule!'));
            }
            return schedule
              .update({
                name,
                details,
                type,
                priority,
                startTime,
                endTime,
                groupId,
              })
              .then(() =>
                Promise.all([
                  tags &&
                    schedule.getTags().then(ts =>
                      ts.forEach((t) => {
                        const tagRemove = tags.find(tag => tag.id === t.id);
                        if (tagRemove === undefined) {
                          t.removeSchedule(schedule);
                        }
                      }),
                    ),
                  tags &&
                    tags.map(t => Tag.findById(t.id)
                      .then(foundTag => foundTag.addSchedule(schedule))),
                ]).then(() => schedule.reload()),
              );
          }),
        );
      },
      messages(schedule) {
        return schedule.getMessages({
          order: [['createdAt', 'DESC']],
        });
      },
      tags(schedule) {
        return schedule.getTags();
      },
    },

    timeSegment: {
      user(timesegment) {
        return timesegment.getUser();
      },
      tags(timesegment) {
        return timesegment.getTags();
      },
      createTimeSegment(_, args, ctx) {
        const {
          scheduleId, type, status, startTime, endTime, userId, note, tags,
        } = args.timeSegment;
        return getAuthenticatedUser(ctx).then(user =>
          Schedule.findById(scheduleId).then((schedule) => {
            if (!schedule) {
              return Promise.reject(Error('Invalid schedule!'));
            }
            return Creators.timeSegment({
              schedule,
              type,
              status,
              startTime,
              endTime,
              note,
              tags,
              user: userId === undefined ? user : { id: userId },
            }).then((res) => {
              logWriter({
                source: user.username,
                action: 'createTimeSegment',
                payload: res,
              });
              return res;
            });
          }),
        );
      },
      removeTimeSegment(_, args, ctx) {
        const { segmentId } = args.timeSegment;
        return getAuthenticatedUser(ctx).then(user =>
          TimeSegment.findById(segmentId).then((segment) => {
            if (!segment) {
              return Promise.reject(Error('Invalid segment!'));
            }
            return segment.destroy().then((rows) => {
              if (rows) {
                logWriter({
                  source: user.username,
                  action: 'removeTimeSegment',
                  payload: rows,
                });
                return true;
              }
              return false;
            });
          }),
        );
      },
      updateTimeSegment(_, args, ctx) {
        const { segmentId, type, status, startTime, endTime, note, tags } = args.timeSegment;
        return getAuthenticatedUser(ctx).then(user =>
          TimeSegment.findById(segmentId).then((segment) => {
            if (!segment) {
              return Promise.reject(Error('Invalid segment!'));
            }
            return segment.update({
              type,
              status,
              startTime,
              endTime,
              note,
            }).then(() =>
              Promise.all([
                tags &&
              segment.getTags().then(ts =>
                ts.forEach((t) => {
                  const tagRemove = tags.find(tag => tag.id === t.id);
                  if (tagRemove === undefined) {
                    t.removeTimesegment(segment);
                  }
                }),
              ),
                tags &&
                tags.map(t => Tag.findById(t.id)
                  .then(foundTag => foundTag.addTimesegment(segment))),
              ]).then(() => {
                logWriter({
                  source: user.username,
                  action: 'updateTimeSegment',
                  payload: args.timeSegment,
                });
                return segment.reload();
              }),
            );
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
        return eventPerms
          .userWantsToRead({
            user: getAuthenticatedUser(ctx),
            event: Event.findById(args.id),
          })
          .then(({ user, event }) => {
            const interimEventObject = event;
            return areEventNotificationsEnableForUser(event, user).then((result) => {
              interimEventObject.notificationsEnabled = result;
              return interimEventObject;
            });
          });
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
      primaryLocation(event) {
        // to avoid a cyclic table associations we are calling 'constraints: false'
        // so we have to do a traditional SELECT to get the item back
        // because there is no forign key
        return EventLocation.findById(event.primaryLocationId);
      },
      createEvent(_, args, ctx) {
        const {
          name,
          details,
          sourceIdentifier,
          permalink,
          priority,
          eventLocations,
          groupId,
        } = args.event;
        return getAuthenticatedUser(ctx).then(user =>
          Group.findById(groupId).then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group!'));
            }
            return Creators.event({
              name,
              details,
              sourceIdentifier,
              permalink,
              priority,
              group,
            }).then((event) => {
              if (typeof eventLocations === 'undefined') return;
              Promise.all(
                eventLocations.map(el =>
                  Creators.eventLocation({
                    name: el.name,
                    detail: el.detail,
                    icon: el.icon,
                    locationLatitude: el.locationLatitude,
                    locationLongitude: el.locationLongitude,
                    event,
                  }),
                ),
              ).then(() => {
                logWriter({
                  source: user.username,
                  action: 'createEvent',
                  payload: args.event,
                });
                push.pushEventToGroup(event);
                return event;
              });
            });
          }),
        );
      },
      updateEvent(_, args, ctx) {
        const {
          id,
          name,
          details,
          sourceIdentifier,
          permalink,
          priority,
          eventLocations,
          groupId,
        } = args.event;
        return getAuthenticatedUser(ctx).then(user =>
          Event.findById(id).then((event) => {
            if (!event) {
              return Promise.reject(Error('Invalid event!'));
            }
            return event
              .update({
                name,
                details,
                sourceIdentifier,
                permalink,
                priority,
                groupId,
              })
              .then(() => {
                // TODO connect pubsub push for updated event
                event.getEventlocations().then((existingLocations) => {
                  if (eventLocations === undefined) return;

                  Promise.all(
                    existingLocations.map((el) => {
                      // is it in the existing request? then do not remove.
                      const loc = eventLocations.find(
                        newLoc =>
                          newLoc.locationLatitude === el.locationLatitude &&
                          newLoc.locationLongitude === el.locationLongitude,
                      );
                      if (loc === undefined) {
                        return el.destroy();
                      }
                      return true;
                    }),
                    eventLocations.map((el) => {
                      const loc = existingLocations.find(
                        newLoc =>
                          newLoc.locationLatitude === el.locationLatitude &&
                          newLoc.locationLongitude === el.locationLongitude,
                      );
                      if (loc) return true;
                      return Creators.eventLocation({
                        name: el.name,
                        detail: el.detail,
                        icon: el.icon,
                        locationLatitude: el.locationLatitude,
                        locationLongitude: el.locationLongitude,
                        event,
                      });
                    }),
                  ).then(() => {
                    event.reload().then((reloadedEvent) => {
                      logWriter({
                        source: user.username,
                        action: 'updateEvent',
                        payload: args.event,
                      });
                      return reloadedEvent;
                    });
                  });
                });
              });
          }),
        );
      },
      subscribe() {
        return withFilter(
          () => pubsub.asyncIterator(PUBSUBS.EVENT.UPDATED),
          (payload, args) =>
            // filter is on the OUTBOUND so check there is outbound data,
            // check its not the users own update, check its for the correct event
            // return TRUE to send to the subscriber FALSE to not
            payload && payload.id === args.eventId,
        );
      },
      eventResponseSubscribe() {
        return withFilter(
          () => pubsub.asyncIterator(PUBSUBS.EVENTRESPONSE.UPDATED),
          (payload, args, ctx) => getAuthenticatedUser(ctx).then(user =>
            // filter is on the OUTBOUND so check there is outbound data,
            // check its not the users own update, check its for the correct event
            // return TRUE to send to the subscriber FALSE to not
            payload && user.id !== payload.userId && payload.eventId === args.eventId,
          ),
        );
      },
      setResponseLocation(args, ctx) {
        const { eventId } = args.location;
        return eventPerms
          .userWantsToWrite({
            user: getAuthenticatedUser(ctx),
            event: Event.findById(eventId),
          })
          .then(({ event, user }) =>
            event.getEventresponses({ where: { userId: user.id } }).then((result) => {
              const updateArgs = { ...args.location };

              if (result.length) {
                updateArgs.eventId = null;
                // update an existing response
                return result[0].update(
                  updateArgs,
                  { fields: ['locationLatitude', 'locationLongitude', 'locationTime'] },
                ).then((eventResponse) => {
                  logWriter({
                    source: user.username,
                    action: 'setResponseLocation',
                    payload: args.location,
                  });
                  pubsub.publish(PUBSUBS.EVENTRESPONSE.UPDATED, eventResponse);
                  event.reload().then((reloadedEvent) => {
                    const intirimEventObject = reloadedEvent;
                    areEventNotificationsEnableForUser(event, user).then((subresult) => {
                      intirimEventObject.notificationsEnabled = subresult;
                      pubsub.publish(PUBSUBS.EVENT.UPDATED, reloadedEvent);
                    });
                  });
                });
              }

              // create a new response with no destination set
              return Creators.eventResponse({
                event,
                user,
                ...updateArgs,
              }).then((eventResponse) => {
                logWriter({
                  source: user.username,
                  action: 'setResponseLocation',
                  payload: eventResponse,
                });
                areEventNotificationsEnableForUser(event, user).then((subResult) => {
                  if (!subResult) {
                    event.addUsersWithEventNotificationEnabled(user);
                  }
                }); pubsub.publish(PUBSUBS.EVENTRESPONSE.UPDATED, eventResponse);
                event.reload().then((reloadedEvent) => {
                  const intirimEventObject = reloadedEvent;
                  areEventNotificationsEnableForUser(event, user).then((subresult) => {
                    intirimEventObject.notificationsEnabled = subresult;
                    pubsub.publish(PUBSUBS.EVENT.UPDATED, reloadedEvent);
                  });
                });
              });
            }),
          );
      },
      setResponse(args, ctx) {
        // Make the passed boolean match the db state for user event notifs
        const syncNotificationStatus = (shouldBeEnabled, event, user) =>
          areEventNotificationsEnableForUser(event, user).then((subresult) => {
            if (subresult && !shouldBeEnabled) {
              event.removeUsersWithEventNotificationEnabled(user).then(() => false);
            } else if (!subresult && shouldBeEnabled) {
              event.addUsersWithEventNotificationEnabled(user).then(() => true);
            }
          });

        // publish the new event and event response, set notification boolean inflight
        // reload event if eventNeedsReload
        const pubSubActions = (
          eventResponse,
          event,
          eventsNeedReload,
          user,
          notificationAnswer,
        ) => {
          pubsub.publish(PUBSUBS.EVENTRESPONSE.UPDATED, eventResponse);
          if (eventsNeedReload) {
            event.reload().then((reloadedEvent) => {
              const intirimEventObject = reloadedEvent;
              intirimEventObject.notificationsEnabled = notificationAnswer;
              pubsub.publish(PUBSUBS.EVENT.UPDATED, intirimEventObject);
            });
          } else {
            const intirimEventObject = event;
            intirimEventObject.notificationsEnabled = notificationAnswer;
            pubsub.publish(PUBSUBS.EVENT.UPDATED, intirimEventObject);
          }
        };

        // Destination will be undefined if user picked unavailable or it doesnt need to change
        // destination will be null to indicate that destination should be removed
        const { id } = args.response;
        return eventPerms
          .userWantsToWrite({
            user: getAuthenticatedUser(ctx),
            event: Event.findById(id),
          })
          .then(({ event, user }) =>
            event.getEventresponses({ where: { userId: user.id } }).then((result) => {
              const updateArgs = { ...args.response };
              delete updateArgs.id;
              // destination not defined (not part of the update)
              if (typeof updateArgs.destination !== 'undefined') {
                // null is truthy so we need this
                // defined but null (as in no destination)
                if (updateArgs.destination !== null) {
                  return event
                    .getEventlocations({ where: { id: updateArgs.destination.id } })
                    .then((destination) => {
                      if (!destination) {
                        return Promise.reject(Error('Unknown destination passed'));
                      }
                      updateArgs.eventlocationId = destination[0].id;
                      delete updateArgs.destination;
                      if (result.length > 0) { // updating an existing response
                        return result[0].update(updateArgs).then((eventResponse) => {
                          syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                            pubSubActions(eventResponse, event, true, user, answer);
                          });
                        });
                      }
                      // create a new response with a destination
                      return Creators.eventResponse({
                        event,
                        user,
                        destination: destination[0],
                        ...updateArgs,
                      }).then((eventResponse) => {
                        logWriter({
                          source: user.username,
                          action: 'setResponse',
                          payload: eventResponse,
                        });
                        syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                          pubSubActions(eventResponse, event, false, user, answer);
                        });
                      });
                    });
                }
                // destination passed is null (but defined)
                if (result.length) {
                  // (remove the location from an existing response)
                  updateArgs.eventlocationId = null;
                  // update an existing response but no destination
                  return result[0].update(updateArgs).then((eventResponse) => {
                    logWriter({
                      source: user.username,
                      action: 'setResponse',
                      payload: eventResponse,
                    });
                    syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                      pubSubActions(eventResponse, event, true, user, answer);
                    });
                  });
                }
                // create a new response with no destination set
                return Creators.eventResponse({
                  event,
                  user,
                  ...updateArgs,
                }).then((eventResponse) => {
                  logWriter({
                    source: user.username,
                    action: 'setResponse',
                    payload: eventResponse,
                  });
                  syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                    pubSubActions(eventResponse, event, false, user, answer);
                  });
                });
              }

              // update a response with undefined destination
              if (result.length) {
                return result[0].update(updateArgs).then((eventResponse) => {
                  logWriter({
                    source: user.username,
                    action: 'setResponse',
                    payload: eventResponse,
                  });
                  syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                    pubSubActions(eventResponse, event, true, user, answer);
                  });
                });
              }

              // create a new response with undefined destination
              return Creators.eventResponse({
                event,
                user,
                ...updateArgs,
              }).then((eventResponse) => {
                logWriter({
                  source: user.username,
                  action: 'setResponse',
                  payload: eventResponse,
                });
                syncNotificationStatus(updateArgs.status !== 'unavailable', event, user).then((answer) => {
                  pubSubActions(eventResponse, event, false, user, answer);
                });
              });
            }),
          );
      },
      messages(event) {
        return event.getMessages({
          order: [['createdAt', 'DESC']],
        });
      },
      setEventNotifications(args, ctx) {
        const { eventId, enabled } = args.notifications;
        return getAuthenticatedUser(ctx).then(user =>
          Event.findById(eventId).then((event) => {
            if (!event) {
              return Promise.reject(Error('Unknown event passed'));
            }
            logWriter({
              source: user.username,
              action: 'setEventNotifications',
              payload: args.notifications,
            });
            if (!enabled) {
              event.reload().then((reloadedEvent) => {
                const intirimEventObject = reloadedEvent;
                intirimEventObject.notificationsEnabled = enabled;
                pubsub.publish(PUBSUBS.EVENT.UPDATED, intirimEventObject);
              });
              return event.removeUsersWithEventNotificationEnabled(user).then(() => false);
            }
            event.reload().then((reloadedEvent) => {
              const intirimEventObject = reloadedEvent;
              intirimEventObject.notificationsEnabled = enabled;
              pubsub.publish(PUBSUBS.EVENT.UPDATED, intirimEventObject);
            });
            return event.addUsersWithEventNotificationEnabled(user).then(() => true);
          }),
        );
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
          return org.getGroups({ where: { id: args.id } });
        }
        if (args.filter) {
          return org.getGroups({
            where: { name: { [Op.like]: `%${args.filter}%` } },
            order: [['id', 'ASC']],
          });
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
        return getAuthenticatedUser(ctx).then(user =>
          Organisation.findById(user.organisationId).then(organisation =>
            Creators.group({
              name,
              icon,
              tags,
              users: [user],
              organisation,
            }).then((res) => {
              logWriter({
                source: user.username,
                action: 'createTimeSegment',
                payload: res,
              });
              return res;
            })
            ,
          ),
        );
      },
      updateGroup(_, args, ctx) {
        const { id, name, tags, icon, users } = args.group;
        return getAuthenticatedUser(ctx).then(user =>
          Group.findById(id).then((group) => {
            if (!group) {
              return Promise.reject(Error('Invalid group!'));
            }
            return group
              .update({
                name,
                icon,
              })
              .then(() =>
                Promise.all([
                  tags &&
                    group.getTags().then(ts =>
                      ts.forEach((t) => {
                        const tagRemove = tags.find(tag => tag.id === t.id);
                        if (tagRemove === undefined) {
                          t.removeGroup(group);
                        }
                      }),
                    ),
                  tags &&
                    tags.map(t => Tag.findById(t.id).then(foundTag => foundTag.addGroup(group))),
                  users &&
                    group.getUsers().then(us =>
                      us.forEach((u) => {
                        const userRemove = users.find(uu => uu.id === u.id);
                        if (userRemove === undefined) {
                          u.removeGroup(group);
                        }
                      }),
                    ),
                  users &&
                    users.map(u => User.findById(u.id)
                      .then(foundUser => foundUser.addGroup(group))),
                ]).then(() => {
                  logWriter({
                    source: user.username,
                    action: 'updateGroup',
                    payload: args.group,
                  });
                  return group.reload();
                }),
              );
          }),
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
                return Promise.reject(Error(`${user.id} is already a member of ${groupId}!`));
              }
              return group.addUser(user).then(() => {
                logWriter({
                  source: user.username,
                  action: 'addUserToGroup',
                  payload: args.groupUpdate,
                });
                return group;
              });
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
              if (rows) {
                logWriter({
                  source: user.username,
                  action: 'removeUserFromGroup',
                  payload: args.groupUpdate,
                });
                return group;
              }
              return false;
            });
          }),
        );
      },
      tags(group) {
        return group.getTags();
      },
      messages(group) { // NYI
        return group.getMessages({
          order: [['createdAt', 'DESC']],
        });
      },
    },
    message: {
      user(message) {
        return message.getUser();
      },
      createMessage(_, args, ctx) {
        const { text, image, eventId, scheduleId, groupId } = args.message;
        return getAuthenticatedUser(ctx).then(user =>
          Creators.message({
            text,
            image,
            eventId,
            scheduleId,
            groupId,
            user,
          }).then((message) => {
            logWriter({
              source: user.username,
              action: 'createMessage',
              payload: message,
            });
            pubsub.publish(PUBSUBS.MESSAGE.CREATED, message);
            push.pushMessage({ message, eventId, scheduleId, groupId });
            return message;
          }),
        );
      },
      createSystemMessage(_, args, ctx) {
        const { text, image, eventId, scheduleId, groupId } = args.message;
        return getAuthenticatedUser(ctx).then(user =>
          Creators.message({
            text,
            image,
            eventId,
            scheduleId,
            groupId,
            systemMessage: true,
          }).then((message) => {
            logWriter({
              source: user.username,
              action: 'createMessage',
              payload: message,
            });
            pubsub.publish(PUBSUBS.MESSAGE.CREATED, message);
            push.pushMessage({ message, eventId, scheduleId, groupId });
            return message;
          }),
        );
      },
      subscribe() {
        return withFilter(
          () => pubsub.asyncIterator(PUBSUBS.MESSAGE.CREATED),
          (payload, args, ctx) => getAuthenticatedUser(ctx).then(user =>
            // filter is on the OUTBOUND so check there is outbound data,
            // check its not the users own message, check its for the correct event
            // return TRUE to send to the subscriber FALSE to not
            payload && user.id !== payload.userId && payload.eventId === args.eventId,
          ),
        );
      },
    },
    push: {
      async sendTestPush(args, ctx) {
        const device = await getAuthenticatedDevice(ctx);
        const result = await push.sendTestPush({
          devices: [device],
          message: 'Test push notification \u2728\u2705\uD83D\uDC8C\uD83D\uDC4D',
          delay: args.vars && args.vars.delay ? args.vars.delay : false,
        });

        return result;
      },
    },
    subscription: {
      // Handles logic for incoming sub connections. (User validity only so far)
      // NOT the actual data return for the subs they are under each respective
      // object in the main logic
      defaultOnOperation(baseParams, args, ctx) {
        const newBaseParams = Object.assign({}, baseParams); // clone object
        return getAuthenticatedUser(ctx)
          .then((user) => {
            if (!user.id) {
              return Promise.reject(Error('Unauthorized!'));
            }

            newBaseParams.context = ctx;
            return newBaseParams;
          });
      },
    },
  };

  return handlers;
};

export default getHandlers;
