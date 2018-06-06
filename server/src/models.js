import Sequelize from 'sequelize';

export const defineModels = (db) => {
  // We can have multiple orgaisations so we can support multi-tenancy but the
  // the reality is we'll probably only have one
  const OrganisationModel = db.define('organisation', {
    name: { type: Sequelize.STRING },
  });

  const GroupModel = db.define('group', {
    name: { type: Sequelize.STRING },
    icon: { type: Sequelize.STRING },
  });

  const UserModel = db.define('user', {
    email: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    displayName: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    version: { type: Sequelize.INTEGER }, // version the password
  });

  const TagModel = db.define('tag', {
    name: { type: Sequelize.STRING },
    type: { type: Sequelize.STRING },
  });

  const DeviceModel = db.define('device', {
    uuid: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    pushToken: { type: Sequelize.STRING },
    locationLat: { type: Sequelize.STRING },
    locationLon: { type: Sequelize.STRING },
    locationTimestamp: { type: Sequelize.INTEGER },
  });

  const EventModel = db.define('event', {
    name: { type: Sequelize.STRING },
    externalIdentifier: { type: Sequelize.STRING },
    details: { type: Sequelize.STRING },
    sourceIdentifier: { type: Sequelize.STRING },
    permalink: { type: Sequelize.STRING },
    startTime: { type: Sequelize.INTEGER },
    endTime: { type: Sequelize.INTEGER },
  });

  const ScheduleModel = db.define('schedule', {
    name: { type: Sequelize.STRING },
    details: { type: Sequelize.STRING },
    priority: { type: Sequelize.INTEGER },
    startTime: { type: Sequelize.INTEGER },
    endTime: { type: Sequelize.INTEGER },
  });

  const TimeSegmentModel = db.define('timesegment', {
    status: { type: Sequelize.INTEGER },
    startTime: { type: Sequelize.INTEGER },
    endTime: { type: Sequelize.INTEGER },
    lastUpdate: { type: Sequelize.INTEGER },
  });

  const EventResponseModel = db.define('eventresponse', {
    status: { type: Sequelize.STRING },
    detail: { type: Sequelize.STRING },
    eta: { type: Sequelize.INTEGER },
    locationLatitude: { type: Sequelize.FLOAT },
    locationLongitude: { type: Sequelize.FLOAT },
    locationTime: { type: Sequelize.INTEGER },
  });

  const EventLocationModel = db.define('eventlocation', {
    name: { type: Sequelize.STRING },
    detail: { type: Sequelize.STRING },
    icon: { type: Sequelize.STRING },
    locationLatitude: { type: Sequelize.FLOAT },
    locationLongitude: { type: Sequelize.FLOAT },
  });

  const MessageModel = db.define('message', {
    text: { type: Sequelize.STRING },
    edited: { type: Sequelize.BOOLEAN },
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

  // event responses belong to a combination of user/event
  EventResponseModel.belongsTo(EventModel);
  EventModel.hasMany(EventResponseModel);
  EventResponseModel.belongsTo(UserModel);
  UserModel.hasMany(EventResponseModel);

  // event marker locations belong to an event
  EventLocationModel.belongsTo(EventModel);
  EventModel.hasMany(EventLocationModel);
  // 'constraints: false ' to avoid Cyclic dependency
  // https://github.com/sequelize/sequelize/issues/1717
  EventModel.belongsTo(EventLocationModel, { as: 'primaryLocation', constraints: false });

  // event marker locations belong to a eventResponse
  EventResponseModel.belongsTo(EventLocationModel);
  EventLocationModel.hasMany(EventResponseModel);

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
