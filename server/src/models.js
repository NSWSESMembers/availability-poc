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

// users can only belong to one organisation for now
UserModel.belongsTo(OrganisationModel);

// devices belong to a single user
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
  return Organisation.create({
    name: "NSW SES",
  }).then((org) => {
    return bcrypt.hash("testing", 10).then((hash) => {
      return User.create({
        id: 69,
        username: "chris",
        password: "test",
        email: "test@miceli.net.au",
        deviceId: "1234-5678-1234-5678"
      }).then((user) => {
        return Promise.all([
          // create a starter group
          Group.create({
            name: "Bankstown"
          }).then((group) => {
            return Promise.all([
              // add user to group
              group.addUsers(user),

              // create a schedule
              Schedule.create({
                name: "Bankstown Roster"
              }).then((schedule) => {

                // attach the schedule to a group
                schedule.setGroup(group);
              })
            ]);
          }),

          // create a device
          Device.create({
            uuid: '1234abc',
          }).then((device) => {
            device.setUser(user);
          }),

          // add the user to the organisation
          user.setOrganisation(org),
        ]);
      });
    });
  }).then(() => {
    console.log('Finished creating test data');
  }).catch((e) => {
    console.log('Epic fail while trying to load test data');
    console.log(e);
  });
});

export { Organisation, Group, User, Device, Event, Schedule, TimeSegment };
