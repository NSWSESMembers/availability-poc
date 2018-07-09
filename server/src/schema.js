import { makeExecutableSchema } from 'graphql-tools';

export const Schema = [
  `
  scalar Date

  input CreateOrganisationInput {
    name: String!
  }

  input LocationUpdateInput {
    locationLat: String!
    locationLon: String!
  }

  input DeviceUpdateInput {
    name: String
    token: String!
  }

  input TagInput {
    id: Int!
    name: String,
    type: String,
  }

  input UserInput {
    id: Int!
    displayName: String,
  }

  input CreateGroupInput {
    name: String!
    tags: [TagInput]
    icon: String
    users: [UserInput]
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
    priority: Int
    name: String!
    details: String!
    type: String
    startTime: Int!
    endTime: Int!
    groupId: Int!
    tags: [TagInput]
  }

  input UpdateScheduleInput {
    id: Int!
    priority: Int
    name: String!
    details: String!
    type: String
    startTime: Int!
    endTime: Int!
    groupId: Int!
    tags: [TagInput]
  }

  input createTimeSegmentInput {
    scheduleId: Int!
    type: String!
    status: String!
    startTime: Int!
    endTime: Int!
    userId: Int
    note: String
    tags: [TagInput]
  }

  input updateTimeSegmentInput {
    segmentId: Int!
    type: String!
    status: String!
    startTime: Int!
    endTime: Int!
    note: String
    tags: [TagInput]
  }

  input removeTimeSegmentInput {
    segmentId: Int!
  }

  input AddUserToGroupInput {
    groupId: Int!
  }

  input RemoveUserFromGroupInput {
    groupId: Int!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input updateUserProfileInput {
    displayName: String!
  }

  input DeleteUserInput {
    username: String!
    email: String!
  }

  input EventLocationInput {
    id: Int! # unique id for the Event Location
  }

  input SetEventResponseInput {
    id: Int!
    status: String
    detail: String
    locationLatitude: Float
    locationLongitude: Float
    locationTime: Int
    destination: EventLocationInput
    eta: Int
  }

  input SetEventResponseLocationInput {
    eventId: Int!
    locationLatitude: Float
    locationLongitude: Float
    locationTime: Int
  }

  input CreateMessageInput {
    text: String
    image: String
    eventId: Int
    scheduleId: Int
    groupId: Int
  }

  input CreateSystemMessageInput {
    text: String
    image: String
    eventId: Int
    scheduleId: Int
    groupId: Int
  }

  input LocationInput {
    name: String
    detail: String
    icon: String
    locationLatitude: Float!
    locationLongitude: Float!
  }

  input CreateEventInput {
    name: String!
    details: String!
    sourceIdentifier: String
    permalink: String
    priority: Int
    eventLocations: [LocationInput]
    groupId: Int!
  }

  input UpdateEventInput {
    id: Int!
    name: String!
    details: String!
    sourceIdentifier: String
    permalink: String
    eventLocations: [LocationInput]
    groupId: Int!
  }

  input UpdateGroupInput {
    id: Int!
    name: String!
    tags: [TagInput]
    icon: String
    users: [UserInput]
  }

  input SendTestPushInput {
    delay: Boolean
  }

  input SetEventNotificationsInput {
    enabled: Boolean!
    eventId: Int!
  }

  type Organisation {
    id: Int! # unique id for the organisation
    name: String!
    users: [User]!
    groups(id: Int,filter: String): [Group]!
    tags(nameFilter: String,typeFilter: String): [Tag]!
    capabilities: [Capability]!
  }

  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    icon: String # icon
    users: [User]! # users in the group
    schedules: [Schedule]! # schedules associated with this group
    events: [Event]! # events associated with this group
    tags: [Tag]! # tags associdated with this group
    createdAt: Date # sequelize managed field
    updatedAt: Date # sequelize managed field
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    displayName: String # full name of user
    organisation: Organisation! # the organisation this user belongs to
    groups(id: Int): [Group]! # groups the user belongs to
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
    type: String!
  }

  type Capability {
    id: Int!
    name: String!
  }

  type Device {
    id: Int!
    name: String  # device name from device info
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
    sourceIdentifier: String,
    permalink: String,
    priority: Int,
    group: Group!
    notificationsEnabled: Boolean,
    responses: [EventResponse]
    messages: [Message]
    eventLocations: [EventLocation]
    primaryLocation: EventLocation
    startTime: Int!
    endTime: Int!
  }

  type Message {
    id: Int!
    text: String
    edited: Boolean
    image: String
    createdAt: Date # sequelize managed field
    user: User
  }

  type EventResponse {
    id: Int!
    event: Event!
    user: User!
    status: String!
    detail: String
    locationLatitude: Float
    locationLongitude: Float
    locationTime: Int
    destination: EventLocation
    eta: Int!
  }

  type EventLocation {
    id: Int! # unique id for the EventMarker
    event: Event!
    name: String
    detail: String
    icon: String
    locationLatitude: Float!
    locationLongitude: Float!
  }

  type Schedule {
    group: Group!
    id: Int!
    name: String!
    details: String!
    type: String!,
    priority: Int
    startTime: Int!
    endTime: Int!
    timeSegments(userIdFilter: Int): [TimeSegment]!
    tags: [Tag] # tags associated with this schedule
  }

  type TimeSegment {
    id: Int!
    type: String!
    schedule: Schedule!
    user: User!
    status: String
    startTime: Int!
    endTime: Int!
    note: String
    tags: [Tag] # tags associated with this timeSegment
  }

  # query for types
  type Query {
    # Return the entity representing the current user
    user: User

    # Get the entity representing the current device
    device: Device

    # return an event by ID
    event(id: Int!): Event

    # return a schedule by ID
    schedule(id: Int!): Schedule
  }

  type Mutation {
    createGroup(group: CreateGroupInput!): Group
    updateGroup(group: UpdateGroupInput!): Group
    createEvent(event: CreateEventInput!): Event
    updateEvent(event: UpdateEventInput!): Event
    createUser(user: CreateUserInput!): User
    updateUserProfile(user: updateUserProfileInput!): User
    deleteUser(user: DeleteUserInput!): User
    createSchedule(schedule: CreateScheduleInput!): Schedule
    updateSchedule(schedule: UpdateScheduleInput!): Schedule
    createMessage(message: CreateMessageInput!): Message
    createSystemMessage(message: CreateSystemMessageInput!): Message
    createTimeSegment(timeSegment: createTimeSegmentInput!): TimeSegment
    updateTimeSegment(timeSegment: updateTimeSegmentInput!): TimeSegment
    removeTimeSegment(timeSegment: removeTimeSegmentInput!): Boolean
    addUserToGroup(groupUpdate: AddUserToGroupInput!): Group
    removeUserFromGroup(groupUpdate: RemoveUserFromGroupInput!): Group
    createOrganisation(organisation: CreateOrganisationInput!): Organisation
    login(user: LoginInput!): User
    signup(user: SignupInput!): User
    updateLocation(location: LocationUpdateInput!): Boolean
    updateDevice(device: DeviceUpdateInput!): Device
    setEventResponse(response: SetEventResponseInput!): EventResponse
    setEventResponseLocation(location:SetEventResponseLocationInput!): EventResponse
    sendTestPush(vars: SendTestPushInput): Boolean  # send a push notification to the requesting device
    setEventNotifications(notifications: SetEventNotificationsInput): Boolean
  }

  type Subscription {
    message(eventId: Int,groupId: Int): Message
    eventResponse(eventId: Int!): EventResponse
    event(eventId: Int!): Event
  }

  schema {
    query: Query,
    mutation: Mutation
    subscription: Subscription
  }
`,
];

export const getSchema = resolvers =>
  makeExecutableSchema({
    typeDefs: Schema,
    resolvers,
  });

export default getSchema;
