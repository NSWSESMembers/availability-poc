import { _ } from 'lodash';
import faker from 'faker';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

// initialize our database
const db = new Sequelize('avail', null, null, {
  dialect: 'sqlite',
  storage: './avail.sqlite',
  logging: console.log, // mark this true if you want to see logs
});

// We can have multiple orgaisations so we can support multi-tenancy but the
// the reality is we'll probably only have one
const OrganisationModel = db.define('organisation', {
  name: { type: Sequelize.STRING },
});

const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
});

const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  version: { type: Sequelize.INTEGER }, // version the password
});

const DeviceModel = db.define('device', {
  uuid: { type: Sequelize.STRING },
  pushToken: { type: Sequelize.STRING },
  locationLat: { type: Sequelize.STRING },
  locationLon: { type: Sequelize.STRING },
  locationTimestamp: { type: Sequelize.INTEGER },
});

const EventModel = db.define('event', {
  details: { type: Sequelize.STRING },
});

const ScheduleModel = db.define('schedule', {
  name: { type: Sequelize.STRING },
});

const TimeSegmentModel = db.define('timesegment', {
  status: { type: Sequelize.INTEGER },
  startTime: { type: Sequelize.INTEGER },
  endTime: { type: Sequelize.INTEGER },
  lastUpdate: { type: Sequelize.INTEGER },
});

// users <-> groups (many-to-many)
UserModel.belongsToMany(GroupModel, { through: 'group_user' });
GroupModel.belongsToMany(UserModel, { through: 'group_user' });

// users <-> events (many-to-many)
UserModel.belongsToMany(EventModel, { through: 'event_user' });
EventModel.belongsToMany(UserModel, { through: 'event_user' });

// users can belong to more than one unit
UserModel.belongsToMany(OrganisationModel, { through: 'user_organisation'});

// devices are linked to a single user
DeviceModel.belongsTo(UserModel);

// events are created for a single group
EventModel.belongsTo(GroupModel);

// schedules are created for a single group
ScheduleModel.belongsTo(GroupModel);

// time segments belong to a combination of user/schedule
TimeSegmentModel.belongsTo(ScheduleModel);
TimeSegmentModel.belongsTo(UserModel);

const Organisation = db.models.organisation;
const Group = db.models.group;
const User = db.models.user;
const Device = db.models.device;
const Event = db.models.event;
const Schedule = db.models.schedule;
const TimeSegment = db.models.timesegment;

db.sync({force: true}).then(() => {
    return bcrypt.hash("testing", 10).then((hash) => {
      User.create({
          username: "chris",
          password: "test",
          email: "test@miceli.net.au",
          deviceId: "1234-5678-1234-5678"
      }).then((user) => {
        Group.create({
          name: "Bankstown"
        }).then((group) => {
          group.addUsers(user);
        }).then((group) => {
            Schedule.create({
              name: "Bankstown Roster"
            }).then((schedule) => {
              schedule.setGroup(group);
            });
        });
      });
    });
});

export { Organisation, Group, User, Device, Event, Schedule, TimeSegment };
