import GraphQLDate from 'graphql-date';
import { map } from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import JWT_SECRET from './config';

import { Group, Message, User } from './models';
import {
  locationHandler,
  deviceHandler,
  scheduleHandler,
  groupHandler,
  userHandler,
  organisationHandler,
} from './logic';

export const Resolvers = {
  Query: {
    user(_, args, ctx) {
      return userHandler.query(_, args, ctx);
    },
    device(_, args, ctx) {
      return deviceHandler.query(_, args, ctx);
    }
  },
  Mutation: {
    createGroup(_, args, ctx) {
      return groupHandler.createGroup(_, args, ctx);
    },
    addUserToGroup(_, args, ctx) {
      return groupHandler.addUserToGroup(_, args, ctx);
    },
    createUser(_, args, ctx) {
      console.log(args);
      return userHandler.createUserX(_, args, ctx);
    },
    deleteUser(_, DeleteUserInput, ctx) {
      const { email, username } = DeleteUserInput.user;
      console.log(DeleteUserInput);
      return User.findOne({ where: { username, email } }).then((existing) => {
        if (existing) {
          return userHandler.deleteUserByPointer(existing)
        }
        return Promise.reject('user not found');
      }).catch(function(err) {
          console.log(err)
          return Promise.reject('user delete error :' + err);
      });
    },
    updateLocation(_, args, ctx) {
      return locationHandler.updateLocation(_, args, ctx);
    },
    signup(_, signinUserInput, ctx) {
      const { deviceId, email, username, password } = signinUserInput.user;
      // find user by email
      return User.findOne({ where: { email } }).then((existing) => {
        if (!existing) {
          // hash password and create user
          return bcrypt.hash(password, 10).then(hash => User.create({
            email,
            password: hash,
            username: username,
            version: 1,
          })).then((user) => {
            return user.setOrganisation(1).then(() => {
              return deviceHandler.addDevice(user, deviceId).then(() => {
                const { id } = user;
                const token = jwt.sign({ id, device: deviceId, email, version: 1 }, JWT_SECRET);
                user.authToken = token;
                ctx.user = Promise.resolve(user);
                return user;
              });
            }).catch(function(err) {
              console.log(err)
              return Promise.reject('user signup error');
            });
          });
        }

        return Promise.reject('email already exists'); // email already exists
      });
    },
    login(_, authInput, ctx) {
      const { username, password, deviceId } = authInput.user;
      return User.findOne({ where: { username } }).then((user) => {
        if (!user){
          return Promise.reject("No Auth for you");
        }
        deviceHandler.addDevice(user, deviceId);
        const token = jwt.sign({
          id: user.id,
          device: deviceId,
          email: user.email,
          version: user.version
        }, JWT_SECRET);
        console.log(token);
        user.authToken = token;
        ctx.user = Promise.resolve(user);
        return user;
      });
    },
    createSchedule(_, args, ctx) {
      console.log(args);
      return scheduleHandler.createSchedule(_, args, ctx);
    }
  },
  Group: {
    users(group, args, ctx) {
      return groupHandler.users(group, args, ctx);
    },
    events(group, args, ctx) {
      return groupHandler.events(group, args, ctx);
    },
    schedules(group, args, ctx) {
      return groupHandler.schedules(group, args, ctx);
    }
  },
  User: {
    groups(user, args, ctx) {
      return userHandler.groups(user, args, ctx);
    },
    events(user, args, ctx) {
      return userHandler.events(user, args, ctx);
    },
    schedules(user, args, ctx) {
      return userHandler.schedules(user, args, ctx);
    },
    devices(user, args, ctx) {
      return userHandler.devices(user, args, ctx);
    },
    authToken(user, args, ctx) {
      return userHandler.authToken(user);
    },
    organisation(user, args, ctx) {
      return userHandler.organisation(user, args, ctx);
    },
  },
  Schedule: {
    timeSegments(schedule, args, ctx) {
      return scheduleHandler.timeSegments(schedule, args, ctx);
    }
  },
  Organisation: {
    groups(org, args, ctx) {
      return organisationHandler.groups(org, args, ctx);
    },
    users(org, args, ctx) {
      return organisationHandler.users(org, args, ctx);
    },
  }
};

export default Resolvers;
