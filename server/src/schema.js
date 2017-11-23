import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { Resolvers } from './resolvers';

import { Mocks } from './mocks';

export const Schema = [`

  input CreateOrganisationInput {
    name: String!
  }

  input LocationUpdateInput {
    locationLat: String!
    locationLon: String!
  }

  input CreateGroupInput {
    name: String!
  }

  input LoginInput {
    username: String!
    password: String!
    deviceUuid: String!
  }

  input SignupInput {
    username: String!
    password: String!
    email: String!
    deviceUuid: String!
  }

  input CreateScheduleInput {
    name: String!
    groupId: Int!
  }

  input AddUserToGroupInput {
    groupId: Int!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input DeleteUserInput {
    username: String!
    email: String!
  }

  type Organisation {
    id: Int! # unique id for the organisation
    name: String!
    users: [User]!
    groups: [Group]!
    tags: [Tag]!
    capabilities: [Capability]!
  }

  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    schedules: [Schedule]! # schedules associated with this group
    events: [Event]! # events associated with this group
    tags: [Tag]! # tags associdated with this group
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
    tags: [Tag]! # tags associated with this user
    capabilities: [Capability]! # capabilities associdated with this user
    authToken: String!
  }

  type Tag {
    id: Int!
    name: String!
  }

  type Capability {
    id: Int!
    name: String!
  }

  type Device {
    id: Int!
    uuid: String!
    pushToken: String
    locationLat: String
    locationLon: String
    locationTimestamp: Int
  }

  type Event {
    id: Int!
    name: String!
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
    details: String!
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
    # Return the entity representing the current user
    user: User

    # Get the entity representing the current device
    device: Device
  }

  type Mutation {
    createGroup(group: CreateGroupInput!): Group
    createUser(user: CreateUserInput!): User
    deleteUser(user: DeleteUserInput!): User
    createSchedule(schedule: CreateScheduleInput!): Schedule
    addUserToGroup(groupUpdate: AddUserToGroupInput!): Group
    createOrganisation(organisation: CreateOrganisationInput!): Organisation
    login(user: LoginInput!): User
    signup(user: SignupInput!): User
    updateLocation(location: LocationUpdateInput!): Boolean
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
