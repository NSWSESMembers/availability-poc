import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const getResolvers = (handlers) => {
  const {
    device: deviceHandler,
    schedule: scheduleHandler,
    timeSegment: timeSegmentHandler,
    group: groupHandler,
    user: userHandler,
    organisation: organisationHandler,
    event: eventHandler,
    eventResponse: eventResponseHandler,
    message: messageHandler,
    push: pushHandler,
  } = handlers;

  return {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value * 1000); // value from the client
      },
      serialize(value) {
        return Math.round(value.getTime() / 1000); // value sent to the client
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    }),
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
      group(schedule, args, ctx) {
        return scheduleHandler.group(schedule, args, ctx);
      },
      tags(user, args, ctx) {
        return scheduleHandler.tags(user, args, ctx);
      },
    },
    TimeSegment: {
      tags(timesegment, args, ctx) {
        return timeSegmentHandler.tags(timesegment, args, ctx);
      },
      user(timesegment, args, ctx) {
        return timeSegmentHandler.user(timesegment, args, ctx);
      },
    },
    Event: {
      group(event, args, ctx) {
        return eventHandler.group(event, args, ctx);
      },
      responses(eventt, args, ctx) {
        return eventHandler.responses(eventt, args, ctx);
      },
      eventLocations(event, args, ctx) {
        return eventHandler.eventLocations(event, args, ctx);
      },
      primaryLocation(event, args, ctx) {
        return eventHandler.primaryLocation(event, args, ctx);
      },
      messages(group, args, ctx) {
        return eventHandler.messages(group, args, ctx);
      },
    },
    EventResponse: {
      user(response, args, ctx) {
        return eventResponseHandler.user(response, args, ctx);
      },
      destination(response, args, ctx) {
        return eventResponseHandler.destination(response, args, ctx);
      },
    },
    Message: {
      user(message, args, ctx) {
        return messageHandler.user(message, args, ctx);
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
      event(_, args, ctx) {
        return eventHandler.query(_, args, ctx);
      },
      schedule(_, args, ctx) {
        return scheduleHandler.query(_, args, ctx);
      },
    },
    Mutation: {
      createGroup(_, args, ctx) {
        return groupHandler.createGroup(_, args, ctx);
      },
      updateGroup(_, args, ctx) {
        return groupHandler.updateGroup(_, args, ctx);
      },
      addUserToGroup(_, args, ctx) {
        return groupHandler.addUserToGroup(_, args, ctx);
      },
      removeUserFromGroup(_, args, ctx) {
        return groupHandler.removeUserFromGroup(_, args, ctx);
      },
      createEvent(_, args, ctx) {
        return eventHandler.createEvent(_, args, ctx);
      },
      updateEvent(_, args, ctx) {
        return eventHandler.updateEvent(_, args, ctx);
      },
      deleteUser(_, args, ctx) {
        return userHandler.deleteUser(args, ctx);
      },
      updateUserProfile(_, args, ctx) {
        return userHandler.updateUserProfile(_, args, ctx);
      },
      updateDevice(_, args, ctx) {
        return deviceHandler.updateDevice(_, args, ctx);
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
      updateSchedule(_, args, ctx) {
        return scheduleHandler.updateSchedule(_, args, ctx);
      },
      createTimeSegment(_, args, ctx) {
        return timeSegmentHandler.createTimeSegment(_, args, ctx);
      },
      removeTimeSegment(_, args, ctx) {
        return timeSegmentHandler.removeTimeSegment(_, args, ctx);
      },
      updateTimeSegment(_, args, ctx) {
        return timeSegmentHandler.updateTimeSegment(_, args, ctx);
      },
      setEventResponse(_, args, ctx) {
        return eventHandler.setResponse(args, ctx);
      },
      setEventResponseLocation(_, args, ctx) {
        return eventHandler.setResponseLocation(args, ctx);
      },
      createMessage(_, args, ctx) {
        return messageHandler.createMessage(_, args, ctx);
      },
      createSystemMessage(_, args, ctx) {
        return messageHandler.createSystemMessage(_, args, ctx);
      },
      sendTestPush(_, args, ctx) {
        return pushHandler.sendTestPush(args, ctx);
      },
      setEventNotifications(_, args, ctx) {
        return eventHandler.setEventNotifications(args, ctx);
      },
    },
    Subscription: {
      message: {
        resolve: payload => payload,
        subscribe: messageHandler.subscribe(),
      },
      eventResponse: {
        resolve: payload => payload,
        subscribe: eventHandler.eventResponseSubscribe(),
      },
      event: {
        resolve: payload => payload,
        subscribe: eventHandler.subscribe(),
      },
    },
  };
};

export default getResolvers;
