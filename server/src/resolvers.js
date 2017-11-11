import GraphQLDate from 'graphql-date';
import { map } from 'lodash';

import { Group, Message, User } from './models';
import { groupHandler, userHandler } from './logic';

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
    }
  },
  Group: {
  },
  User: {
  },
};

export default Resolvers;
