import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT_SECRET from './config';
import {
  Group,
  User,
  Device,
  Organisation,
  Schedule,
  Event,
} from './models';
import Creators from './creators';

// reusable function to check for a user with context
const getAuthenticatedUser = ctx => ctx.user.then((user) => {
  if (!user) {
    // XXX: remove this
    return User.findById(69);
    // return Promise.reject('Unauthorized');
  }
  return user;
});

const getAuthenticatedDevice = ctx => ctx.device.then((device) => {
  if (!device) {
    return Device.findOne({ where: { userId: 69, uuid: '1234abc' } });
    // return Promise.reject('Unauthorized');
  }
  return device;
});

export const deviceHandler = {
  query(_, args, ctx) {
    return getAuthenticatedDevice(ctx);
  },
  addDevice(user, deviceUuid) {
    return user.getDevices({ where: { uuid: deviceUuid } }).then((existing) => {
      if (existing) {
        return existing;
      }
      return Creators.device({
        uuid: deviceUuid,
        user,
      });
    });
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
};

export const userHandler = {
  query(_, __, ctx) {
    return getAuthenticatedUser(ctx);
  },
  groups(user, args) {
    if (args.id) {
      return user.getGroups({ where: { Id: args.id } });
    }
    return user.getGroups();
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
  capabilities(user) {
    return user.getCapabilities();
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
          deviceHandler.addDevice(user, deviceUuid)
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
      deviceHandler.addDevice(user, deviceUuid).then(() => {
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
};

export const scheduleHandler = {
  timeSegments(schedule) {
    return schedule.getTimesegments();
  },
  group(schedule) {
    return schedule.getGroup();
  },
  createSchedule(_, args) {
    const { name, groupId } = args.schedule;

    return Group.findById(groupId)
      .then((group) => {
        if (!group) {
          return Promise.reject(Error('Invalid group'));
        }
        // TODO: check whether the user is a member of the group
        return Creators.schedule({
          name,
          group,
        });
      });
  },
};

export const timeSegmentHandler = {
  user(timesegment) {
    return timesegment.getUser();
  },
};

export const eventHandler = {
  group(event) {
    return event.getGroup();
  },
  responses(event) {
    return event.getEventresponses();
  },
};

export const eventResponseHandler = {
  user(response) {
    return response.getUser();
  },
};

export const organisationHandler = {
  createOrganisation(_, args) {
    const { name } = args.organisation;
    return Creators.organisation({ name });
  },
  groups(org, args) {
    // TODO: think about who we show the complete organisation group list to
    if (args.id) {
      return org.getGroups({ where: { Id: args.id } });
    }
    return org.getGroups();
  },
  users(org) {
    // TODO: think about who we show the complete organisation user list to
    return org.getUsers();
  },
  tags(org) {
    return org.getTags();
  },
  capabilities(org) {
    return org.getCapabilities();
  },
};

export const groupHandler = {
  users(group) {
    return group.getUsers();
  },
  schedules(group) {
    return group.getSchedules();
  },
  events(group) {
    return group.getEvents();
  },
  createGroup(_, args, ctx) {
    const { name } = args.group;
    return getAuthenticatedUser(ctx)
      .then(user => Organisation.findById(user.organisationId)
        .then(organisation => Creators.group({ name, user, organisation })),
      );
  },
  addUserToGroup(_, args, ctx) {
    const { groupId } = args.groupUpdate;
    return getAuthenticatedUser(ctx).then(user =>
      Group.findById(groupId).then((group) => {
        if (!group) {
          return Promise.reject(Error('Invalid group!'));
        }
        return group.addUser(user).then(() => group);
      }),
    );
  },
  tags(group) {
    return group.getTags();
  },
};
