import GraphQLDate from 'graphql-date';
import { map } from 'lodash';
import jwt from 'jsonwebtoken';
import JWT_SECRET from './config';

import { Group, Message, User } from './models';
import { scheduleHandler, groupHandler, userHandler } from './logic';

export const Resolvers = {
  Query: {
    group(_, args, ctx) {
      return groupHandler.query(_, args, ctx);
    },
    user(_, args, ctx) {
      return userHandler.query(_, args, ctx);
    },
  },
  Mutation: {
    createGroup(_, args, ctx){
        return groupHandler.createGroup(_, args, ctx);
    },
    addUserToGroup(_, args, ctx){
        return groupHandler.addUserToGroup(_, args, ctx);
    },
    createUser(_, args, ctx){
        console.log(args);
        return userHandler.createUserX(_, args, ctx);
    },
    login(_, authInput, ctx){
        const { email, password } = authInput;
        return User.findOne({ where: { email } }).then((user) => {
          console.log(email);
          if (!user){
            return Promise.reject("No Auth for you");
          }
          const token = jwt.sign({
            id: user.id,
            email: user.email,
            version: user.version
          }, JWT_SECRET);
          console.log(token);
          user.auth_token = token;
          ctx.user = Promise.resolve(user);
          return user;
        });
    },
    createSchedule(_, args, ctx){
      console.log(args);
      return scheduleHandler.createSchedule(_, args, ctx);
    }
  },
  Group: {
  },
  User: {
    groups(user, args, ctx){
        return userHandler.groups(user, args, ctx);
    },
    events(user, args, ctx){
        return userHandler.events(user, args, ctx);
    },
    schedules(user, args, ctx){
        return userHandler.schedules(user, args, ctx);
    },
    devices(user, args, ctx){
        return userHandler.devices(user, args, ctx);
    },
    auth_token(user, args, ctx){
      return userHandler.auth_token(user);
    },
  },
  Schedule: {
    timeSegments(schedule, args, ctx){
        return scheduleHandler.timeSegments(schedule, args, ctx);
    }
  }
};

export default Resolvers;
