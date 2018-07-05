// this file is only used by unit tests but is not a unit test
// and therefore does not belong in __tests__

// eslint-disable-next-line import/no-extraneous-dependencies
import SequelizeMock from 'sequelize-mock';

export const defineModels = () => {
  const db = new SequelizeMock();

  // We can have multiple orgaisations so we can support multi-tenancy but the
  // the reality is we'll probably only have one
  const OrganisationModel = db.define('organisation', {
    name: 'Test organisation',
  });

  const GroupModel = db.define('group', {
    name: 'Test group',
  });

  const UserModel = db.define('user', {
    email: 'test@example.com',
    username: 'test',
    name: 'Test User',
    password: 'test',
    version: 1,
  });

  const TagModel = db.define('tag', {
    name: 'test',
    type: 'group',
  });

  const DeviceModel = db.define('device', {
    uuid: '1234abc',
    name: 'test-device',
    pushToken: 'testpushtoken',
    locationLat: -34.4267554,
    locationLon: 150.8880039,
    locationTimestamp: 1514860289,
  });

  const EventModel = db.define('event', {
    name: 'Test event',
    details: 'Details of test event',
    sourceIdentifier: '123-456',
    permalink: 'https://jobsystem.com/jobs/123456',
    priority: 1,
    startTime: 1514860289,
    endTime: 1514860289 + 60 * 60,
  });

  const ScheduleModel = db.define('schedule', {
    name: 'Test schedule',
    details: 'Details of test schedule',
    type: 'local',
    priority: 1,
    startTime: 1514860289,
    endTime: 1514860289 + 60 * 60,
  });

  const TimeSegmentModel = db.define('timesegment', {
    type: 'availability',
    status: 'available',
    startTime: 1514860289,
    endTime: 1514860289 + 60 * 60,
    lastUpdate: 1514860289,
  });

  const EventResponseModel = db.define('eventresponse', {
    status: 'responding',
    detail: 'on my way',
    destination: 'HQ',
    eta: 1514860289,
  });

  const EventLocationModel = db.define('eventlocation', {
    name: 'location1',
    detail: 'mock location',
    icon: 'lhq',
    locationLatitude: '123.456789',
    locationLongitude: '123.456789',
  });

  const MessageModel = db.define('message', {
    text: 'test message',
    edited: false,
  });

  // UserModel has many messages
  // messages belong to a UserModel
  UserModel.hasMany(MessageModel);
  MessageModel.belongsTo(UserModel);

  // GroupModel has many messages
  // message belongs to a GroupModel
  GroupModel.hasMany(MessageModel);
  MessageModel.belongsTo(GroupModel);

  // EventModel has many messages
  // message belongs to a EventModel
  EventModel.hasMany(MessageModel);
  MessageModel.belongsTo(EventModel);

  // ScheduleModel has many messages
  // ScheduleModel belongs to a event
  ScheduleModel.hasMany(MessageModel);
  MessageModel.belongsTo(ScheduleModel);

  // users <-> groups (many-to-many)
  UserModel.belongsToMany(GroupModel, { through: 'group_user' });
  GroupModel.belongsToMany(UserModel, { through: 'group_user' });

  // users <-> events (many-to-many)
  UserModel.belongsToMany(EventModel, { through: 'event_user' });
  EventModel.belongsToMany(UserModel, { through: 'event_user' });

  // users can only belong to one organisation for now
  UserModel.belongsTo(OrganisationModel);
  OrganisationModel.hasMany(UserModel);

  // groups belong to an orgnanisation
  GroupModel.belongsTo(OrganisationModel);
  OrganisationModel.hasMany(GroupModel);

  // devices belong to a single user
  DeviceModel.belongsTo(UserModel);
  UserModel.hasMany(DeviceModel);

  // users -> tags
  UserModel.belongsToMany(TagModel, { through: 'user_tag' });
  TagModel.belongsToMany(UserModel, { through: 'user_tag' });

  // groups -> tags
  GroupModel.belongsToMany(TagModel, { through: 'group_tag' });
  TagModel.belongsToMany(GroupModel, { through: 'group_tag' });

  // timeSegments > tags
  TimeSegmentModel.belongsToMany(TagModel, { through: 'timesegment_tag' });
  TagModel.belongsToMany(TimeSegmentModel, { through: 'timesegment_tag' });

  // schedules -> tags
  ScheduleModel.belongsToMany(TagModel, { through: 'schedule_tag' });
  TagModel.belongsToMany(ScheduleModel, { through: 'schedule_tag' });

  // events are created for a single group
  EventModel.belongsTo(GroupModel);
  GroupModel.hasMany(EventModel);

  // schedules are created for a single group
  ScheduleModel.belongsTo(GroupModel);
  GroupModel.hasMany(ScheduleModel);

  // time segments belong to a combination of user/schedule
  TimeSegmentModel.belongsTo(ScheduleModel);
  ScheduleModel.hasMany(TimeSegmentModel);
  TimeSegmentModel.belongsTo(UserModel);
  UserModel.hasMany(TimeSegmentModel);

  // event locations belong to an event
  EventLocationModel.belongsTo(EventModel);
  EventModel.hasMany(EventLocationModel);

  // event responses belong to a combination of user/event
  EventResponseModel.belongsTo(EventModel);
  EventModel.hasMany(EventResponseModel);
  EventResponseModel.belongsTo(UserModel);
  UserModel.hasMany(EventResponseModel);

  // tags belong to one organisation for now
  TagModel.belongsTo(OrganisationModel);
  OrganisationModel.hasMany(TagModel);

  return {
    Organisation: db.models.organisation,
    Group: db.models.group,
    User: db.models.user,
    Tag: db.models.tag,
    Device: db.models.device,
    Event: db.models.event,
    Message: db.models.message,
    EventResponse: db.models.eventresponse,
    EventLocation: db.models.eventlocation,
    Schedule: db.models.schedule,
    TimeSegment: db.models.timesegment,
  };
};

export default defineModels;
