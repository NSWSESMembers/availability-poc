import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { Resolvers } from './resolvers';

import { Mocks } from './mocks';

export const Schema = [`

  input CreateOrganisationInput {
    name: String!
  }

  input CreateGroupInput {
    name: String!
    organisation: Int!
  }

  input LoginInput {
    username: String!
    password: String!
    deviceId: String!
  }

  input SignupInput {
    username: String!
    password: String!
    email: String!
    deviceId: String!
  }

  input CreateScheduleInput {
    name: String!
    group_id: Int!
  }

  input AddUserToGroupInput {
    group_id: Int!
    user_id: Int!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  type Organisation {
    id: Int! # unique id for the organisation
    name: String!
    users: [User]!
    groups: [Group]!
  }

  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    schedules: [Schedule]! # schedules associated with this group
    events: [Event]! # events associated with this group
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    organisation: Organisation! # the organisation this user belongs to
    groups: [Group]! # groups the user belongs to
    schedules: [Schedule]! # schedules from groups the user belongs to
    events: [Event]! # events from groups the user belongs to
    devices: [Device]! # devices this user has logged in to
    auth_token: String # json web token for access
  }

  type Device {
    id: Int!
    uuid: String!
    authToken: String
    pushToken: String
    location: String
    locationTimestamp: Int
  }

  type Event {
    id: Int!
    details: String!
    responses: [EventResponse]!
  }

  type EventResponse {
    event: Event!
    user: User!
    status: String!
    detail: String!
  }

  type Schedule {
    id: Int!
    name: String!
    timeSegments: [TimeSegment]!
  }

  type TimeSegment {
    schedule: Schedule!
    user: User!
    status: String
    startTime: Int!
    endTime: Int!
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User

    # Return a group by its id
    group(id: Int!): Group
  }

  type Mutation {
    createGroup(group: CreateGroupInput!): Group
    createUser(user: CreateUserInput!): User
    createSchedule(schedule: CreateScheduleInput!): Schedule
    addUserToGroup(groupUpdate: AddUserToGroupInput!): Group
    createOrganisation(organisation: CreateOrganisationInput!): Organisation
    login(user: LoginInput!): User
    signup(user: SignupInput!): User
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

/*
addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: Mocks,
  preserveResolvers: true,
});
*/

export default executableSchema;
