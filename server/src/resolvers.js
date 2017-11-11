import GraphQLDate from 'graphql-date';
import { map } from 'lodash';

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
    }
  },
  Schedule: {
    timeSegments(schedule, args, ctx){
        return scheduleHandler.timeSegments(schedule, args, ctx);
    }
  }
};

export default Resolvers;
