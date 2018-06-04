import sleep from '../utils';
import { sendPush } from './index';

const getPushEmitters = ({ models }) => {
  const {
    Group,
  } = models;

  const emitters = {
    async sendTestPush({ devices, message, delay }) {
      if (delay) {
        await sleep(5000);
      }
      return sendPush({ devices, message });
    },

    pushScheduleToGroup(schedule) {
      // // TODO: Single joined query
      Group.findById(schedule.groupId).then((group) => {
        group.getUsers().then((users) => {
          const results = [];
          return Promise.all(
            users.map(usr =>
              usr.getDevices().then((dvc) => {
                // unpack the array into the new array
                results.push(...dvc);
              }),
            ),
          ).then(() => {
            sendPush({
              devices: results,
              message: `Schedule #${schedule.id} Created\n${schedule.name}`,
            });
          });
        });
      });
    },
    pushEventToGroup(event) {
      // // TODO: Single joined query
      Group.findById(event.groupId).then((group) => {
        group.getUsers().then((users) => {
          const results = [];
          return Promise.all(
            users.map(usr =>
              usr.getDevices().then((dvc) => {
                // unpack the array into the new array
                results.push(...dvc);
              }),
            ),
          ).then(() => {
            sendPush({
              devices: results,
              title: 'New Event',
              message: `Event #${event.id} Created\n${event.name}`,
              payload: { type: 'event', id: event.id, name: event.name, detail: event.detail },
            });
          });
        });
      });
    },
  };
  return emitters;
};


export default getPushEmitters;
