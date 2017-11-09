import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';

import { Mocks } from './mocks';

export const Schema = [`
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
    jwt: String # json web token for access
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


  schema {
    query: Query
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: {},
});

addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: Mocks,
  preserveResolvers: true,
});

export default executableSchema;
