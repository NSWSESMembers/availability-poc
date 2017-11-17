import {
  deviceHandler,
  scheduleHandler,
  groupHandler,
  userHandler,
  organisationHandler,
} from './logic';

export const Resolvers = {
  Group: {
    users(group, args, ctx) {
      return groupHandler.users(group, args, ctx);
    },
    events(group, args, ctx) {
      return groupHandler.events(group, args, ctx);
    },
    schedules(group, args, ctx) {
      return groupHandler.schedules(group, args, ctx);
    },
    tags(group, args, ctx) {
      return groupHandler.tags(group, args, ctx);
    },
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
    authToken(user) {
      return userHandler.authToken(user);
    },
    organisation(user, args, ctx) {
      return userHandler.organisation(user, args, ctx);
    },
    tags(user, args, ctx) {
      return userHandler.tags(user, args, ctx);
    },
    capabilities(user, args, ctx) {
      return userHandler.capabilities(user, args, ctx);
    },
  },
  Schedule: {
    timeSegments(schedule, args, ctx) {
      return scheduleHandler.timeSegments(schedule, args, ctx);
    },
  },
  Organisation: {
    groups(org, args, ctx) {
      return organisationHandler.groups(org, args, ctx);
    },
    users(org, args, ctx) {
      return organisationHandler.users(org, args, ctx);
    },
    tags(org, args, ctx) {
      return organisationHandler.tags(org, args, ctx);
    },
    capabilities(org, args, ctx) {
      return organisationHandler.capabilities(org, args, ctx);
    },
  },
  Query: {
    user(_, args, ctx) {
      return userHandler.query(_, args, ctx);
    },
    device(_, args, ctx) {
      return deviceHandler.query(_, args, ctx);
    },
  },
  Mutation: {
    createGroup(_, args, ctx) {
      return groupHandler.createGroup(_, args, ctx);
    },
    addUserToGroup(_, args, ctx) {
      return groupHandler.addUserToGroup(_, args, ctx);
    },
    deleteUser(_, args, ctx) {
      return userHandler.deleteUser(args, ctx);
    },
    updateLocation(_, args, ctx) {
      return deviceHandler.updateLocation(_, args, ctx);
    },
    signup(_, args, ctx) {
      return userHandler.signup(args, ctx);
    },
    login(_, args, ctx) {
      return userHandler.login(args, ctx);
    },
    createSchedule(_, args, ctx) {
      return scheduleHandler.createSchedule(_, args, ctx);
    },
  },
};

export default Resolvers;
