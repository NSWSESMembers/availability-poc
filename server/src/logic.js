import { Organisation, Group, User, Device, Event, Schedule, TimeSegment, Tag, Capability } from './models' ;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT_SECRET from './config';
import Sequelize from 'Sequelize';

// reusable function to check for a user with context
const getAuthenticatedUser = ctx => {
  return ctx.user.then(user => {
    if (!user) {
      //XXX: remove this
      return User.findById(69);
      // return Promise.reject('Unauthorized');
    }
    return user;
  });
}

const getAuthenticatedDevice = ctx => {
  return ctx.device.then(device => {
    if (!device) {
      return Device.findOne({ where: { userId: 69, uuid: '1234abc' }});
      // return Promise.reject('Unauthorized');
    }
    return device;
  })
}

export const locationHandler = {
  updateLocation(_, args, ctx) {
    return getAuthenticatedDevice(ctx).then(device => {
      const { locationLat, locationLon } = args.location;
      return device.update({
        locationLat,
        locationLon
      });
    });
  }
}

export const deviceHandler = {
  query(_, args, ctx) {
    return getAuthenticatedDevice(ctx);
  },
  addDevice(user, deviceUuid) {
    return user.getDevices({ where: { uuid: deviceUuid } }).then(existing => {
      if (existing) {
        return existing;
      }
      return Device.create({
        uuid: deviceUuid
      }).then(device => {
        return device.setUser(user);
      });
    });
  }
}

export const userHandler = {
  query(_, args, ctx) {
    return getAuthenticatedUser(ctx);
  },
  createUserX(_, args, ctx) {
    return User.create(args.user);
  },
  deleteUserByPointer(user) {
    return user.destroy();
  },
  groups(user, args, ctx) {
    return user.getGroups();
  },
  events(user, args, ctx) {
    return user.getEvents();
  },
  organisation(user, args, ctx) {
    return user.getOrganisation();
  },
  authToken(user) {
    return Promise.resolve(user.authToken);
  },
  schedules(user, args, ctx) {
    return [];
    return Group.findAll({
      include: [{
        model: User,
        where: { id: user.id }
      }]
   }).then((groups) => {
     return Promise.all(groups.map(async (group) => {
       console.log(group);
       return Schedule.findAll({
         include: [{
           model: Group,
           where: { id: group.id }
         }]
       }).then((schedule) => {
         console.log(schedule);
       })
     }));
   });
  },
  devices(user, args, ctx) {
    return Device.findAll({
      where: { userId: user.id, }
    })
  },
  tags(user, args, ctx) {
     return user.getTags();
  },
  capabilities(user, args, ctx) {
     return user.getCapabilities();
  },
  signup(args, ctx) {
    const { deviceUuid, email, username, password } = args.user;

    const where = {
      $or: [{ email }, { username }],
    };

    return User.findOne({ where })
    .then(existing => {
      // make sure the username/email don't already exist
      if (existing) {
        return Promise.reject('Username/email already exists');
      }
    })
    .then(
      // hash the user's password
      () => bcrypt.hash(password, 10)
    )
    .then(
      // create user object
      hash => User.create({
        email,
        password: hash,
        username: username,
        version: 1,
      })
    )
    .then(
      // now we have the user object we have some stuff to do in parallel
      user => Promise.all([
        // add all users to organisation #1 for now
        user.setOrganisation(1),
        // create a new device with the given UUID
        deviceHandler.addDevice(user, deviceUuid),
      ])
      .then((_, device) => {
        // now sign a new JWT to return to the user
        const { id } = user;
        const token = jwt.sign(
          { id, device: deviceUuid, email, version: 1 },
          JWT_SECRET,
        );
        user.authToken = token;

        // we stuff a Promise that will provide the user into the context
        // so the User resolver knows that it can provide confidential
        // info back to the newly-authenticated client
        ctx.user = Promise.resolve(user);

        // make sure we return the user to the caller of signup()
        return user;
      })
    );
  },
  login(args, ctx) {
    const { username, password, deviceUuid } = args.user;
    return User.findOne({ where: { username } })
    .then((user) => {
      // TODO: actually verify the password
      if (!user) {
        // TODO: change this error message to something more generic
        return Promise.reject("Username doesn't exist");
      }

      deviceHandler.addDevice(user, deviceUuid);
      return user;
    })
    .then(user => {
      const token = jwt.sign({
        id: user.id,
        device: deviceUuid,
        email: user.email,
        version: user.version
      }, JWT_SECRET);
      user.authToken = token;

      // we stuff a Promise that will provide the user into the context
      // so the User resolver knows that it can provide confidential
      // info back to the newly-authenticated client
      ctx.user = Promise.resolve(user);

      // make sure we return the user to the caller of login()
      return user;
    });
  },
}

export const scheduleHandler = {
  timeSegments(schedule, args, ctx) {
    return user.getTimeSegments();
  },
  createSchedule(_, args, ctx) {
    return Schedule.create({ name: args.schedule.name }).then((schedule) => {
      return Group.findById(args.schedule.group_id).then((group) => {
        schedule.setGroup(group);
        return schedule;
      });
    });
  }
}

export const organisationHandler = {
  createOrganisation(_, args, ctx) {
    return Organisation.create(args.organisation);
  },
  groups(org, args, ctx) {
    // TODO: think about who we show the complete organisation group list to
    return Group.findAll({ orgnisationId: org.id });
  },
  users(org, args, ctx) {
    // TODO: think about who we show the complete organisation user list to
    return User.findAll({ organisationId: org.id })
  },
  tags(org, args, ctx) {
    return org.getTags();
  },
  capabilities(org, args, ctx) {
    return org.getCapabilities();
  }
}

export const groupHandler = {
  users(group, args, ctx) {
    return group.getUsers();
  },
  schedules(group, args, ctx) {
    return Schedule.findAll({ groupId: group.id });
  },
  events(group, args, ctx) {
    return Event.findAll({ groupId: group.id });
  },
  createGroup(_, args, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {
      return Group.create(args.group).then((group) => {
        group.addUsers(user);
        return group;
      });
    });
  },
  addUserToGroup(_, args, ctx) {
    console.log(args.groupUpdate);
    return getAuthenticatedUser(ctx).then(() => {
      return Group.findById(args.groupUpdate.group_id).then((group) => {
        if (!group) {
            return Promise.reject("No group!");
        }
        User.findById(args.groupUpdate.user_id).then((user) => {
            if (!user) {
                return Promise.reject("No user!");
            }
            group.addUser(user).then(() => {return group;});
        })
      })
    })
  },
  tags(group, args, ctx) {
     return group.getTags();
  },
}

/*export const

export const messageLogic = {
  from(message) {
    return message.getUser({ attributes: ['id', 'username'] });
  },
  to(message) {
    return message.getGroup({ attributes: ['id', 'name'] });
  },
  createMessage(_, createMessageInput, ctx) {
    const { text, groupId } = createMessageInput.message;

    return getAuthenticatedUser(ctx)
      .then(user => user.getGroups({ where: { id: groupId }, attributes: ['id'] })
        .then((group) => {
          if (group.length) {
            return Message.create({
              userId: user.id,
              text,
              groupId,
            });
          }
          return Promise.reject('Unauthorized');
        }));
  },
};

export const groupLogic = {
  users(group) {
    return group.getUsers({ attributes: ['id', 'username'] });
  },
  messages(group, { messageConnection = {} }) {
    const { first, last, before, after } = messageConnection;

    // base query -- get messages from the right group
    const where = { groupId: group.id };

    // because we return messages from newest -> oldest
    // before actually means newer (date > cursor)
    // after actually means older (date < cursor)

    if (before) {
      // convert base-64 to utf8 iso date and use in Date constructor
      where.id = { $gt: Buffer.from(before, 'base64').toString() };
    }

    if (after) {
      where.id = { $lt: Buffer.from(after, 'base64').toString() };
    }

    return Message.findAll({
      where,
      order: [['id', 'DESC']],
      limit: first || last,
    }).then((messages) => {
      const edges = messages.map(message => ({
        cursor: Buffer.from(message.id.toString()).toString('base64'), // convert createdAt to cursor
        node: message, // the node is the message itself
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage() {
            if (messages.length < (last || first)) {
              return Promise.resolve(false);
            }

            return Message.findOne({
              where: {
                groupId: group.id,
                id: {
                  [before ? '$gt' : '$lt']: messages[messages.length - 1].id,
                },
              },
              order: [['id', 'DESC']],
            }).then(message => !!message);
          },
          hasPreviousPage() {
            return Message.findOne({
              where: {
                groupId: group.id,
                id: where.id,
              },
              order: [['id']],
            }).then(message => !!message);
          },
        },
      };
    });
  },
  query(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then(user => Group.findOne({
      where: { id },
      include: [{
        model: User,
        where: { id: user.id },
      }],
    }));
  },
  createGroup(_, createGroupInput, ctx) {
    const { name, userIds } = createGroupInput.group;

    return getAuthenticatedUser(ctx)
      .then(user => user.getFriends({ where: { id: { $in: userIds } } })
        .then((friends) => { // eslint-disable-line arrow-body-style
          return Group.create({
            name,
          }).then((group) => { // eslint-disable-line arrow-body-style
            return group.addUsers([user, ...friends]).then(() => {
              group.users = [user, ...friends];
              return group;
            });
          });
        }));
  },
  deleteGroup(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then((user) => { // eslint-disable-line arrow-body-style
      return Group.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then(group => group.getUsers()
        .then(users => group.removeUsers(users))
        .then(() => Message.destroy({ where: { groupId: group.id } }))
        .then(() => group.destroy()));
    });
  },
  leaveGroup(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {
      if (!user) {
        return Promise.reject('Unauthorized');
      }

      return Group.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then((group) => {
        if (!group) {
          Promise.reject('No group found');
        }

        return group.removeUser(user.id)
          .then(() => group.getUsers())
          .then((users) => {
            // if the last user is leaving, remove the group
            if (!users.length) {
              group.destroy();
            }
            return { id };
          });
      });
    });
  },
  updateGroup(_, updateGroupInput, ctx) {
    const { id, name } = updateGroupInput.group;

    return getAuthenticatedUser(ctx).then((user) => {  // eslint-disable-line arrow-body-style
      return Group.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then(group => group.update({ name }));
    });
  },
};

export const userLogic = {
  email(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id === user.id) {
        return currentUser.email;
      }

      return Promise.reject('Unauthorized');
    });
  },
  friends(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return user.getFriends({ attributes: ['id', 'username'] });
    });
  },
  groups(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return user.getGroups();
    });
  },
  jwt(user) {
    return Promise.resolve(user.jwt);
  },
  messages(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    });
  },
  query(_, args, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {
      if (user.id === args.id || user.email === args.email) {
        return user;
      }

      return Promise.reject('Unauthorized');
    });
  },
};

export const subscriptionLogic = {
  groupAdded(baseParams, args, ctx) {
    return getAuthenticatedUser(ctx)
      .then((user) => {
        if (user.id !== args.userId) {
          return Promise.reject('Unauthorized');
        }

        baseParams.context = ctx;
        return baseParams;
      });
  },
  messageAdded(baseParams, args, ctx) {
    return getAuthenticatedUser(ctx)
      .then(user => user.getGroups({ where: { id: { $in: args.groupIds } }, attributes: ['id'] })
      .then((groups) => {
        // user attempted to subscribe to some groups without access
        if (args.groupIds.length > groups.length) {
          return Promise.reject('Unauthorized');
        }

        baseParams.context = ctx;
        return baseParams;
      }));
  },
};
*/
