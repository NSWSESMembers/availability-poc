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

  const CapabilityModel = db.define('capability', {
    name: 'test',
  });

  const TagModel = db.define('tag', {
    name: 'test',
  });

  const DeviceModel = db.define('device', {
    uuid: '1234abc',
    pushToken: 'testpushtoken',
    locationLat: -34.4267554,
    locationLon: 150.8880039,
    locationTimestamp: 1514860289,
  });

  const EventModel = db.define('event', {
    name: 'Test event',
    details: 'Details of test event',
  });

  const ScheduleModel = db.define('schedule', {
    name: 'Test schedule',
    details: 'Details of test schedule',
    startTime: 1514860289,
    endTime: 1514860289 + (60 * 60),
  });

  const TimeSegmentModel = db.define('timesegment', {
    status: 'available',
    startTime: 1514860289,
    endTime: 1514860289 + (60 * 60),
    lastUpdate: 1514860289,
  });

  const EventResponseModel = db.define('eventresponse', {
    status: 'responding',
    detail: 'on my way',
    destination: 'HQ',
    eta: 1514860289,
  });

  const EventLocationModel = db.define('eventlocation', {
    name: 'marker1',
    detail: 'mock marker',
    icon: 'marker1',
    locationLatitude: '123.456789',
    locationLongitude: '123.456789',
  });

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

  // users belong to capability tags
  UserModel.belongsToMany(CapabilityModel, { through: 'user_capability' });
  CapabilityModel.belongsToMany(UserModel, { through: 'user_capability' });

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

  // event marker locations belong to an event
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

  // tags belong to one organisation for now
  CapabilityModel.belongsTo(OrganisationModel);
  OrganisationModel.hasMany(CapabilityModel);

  return {
    Organisation: db.models.organisation,
    Group: db.models.group,
    User: db.models.user,
    Capability: db.models.capability,
    Tag: db.models.tag,
    Device: db.models.device,
    Event: db.models.event,
    EventResponse: db.models.eventresponse,
    EventMarker: db.models.eventmarker,
    Schedule: db.models.schedule,
    TimeSegment: db.models.timesegment,
  };
};

export default defineModels;
