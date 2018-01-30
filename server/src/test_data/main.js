import faker from 'faker';
import { distantFuture, nowInUTC } from '../constants';

import generateTestUser from './test_user';


export const loadTestData = (Creators, models) =>
  Creators.organisation({
    name: 'NSW SES',
  }).then((organisation) => {
    const addTestUserAndGroup = (id, username, email, groupName) => Creators.user({
      id,
      username,
      password: 'test123',
      email,
      organisation,
    }).then((user) => {
      Promise.all([
        Creators.capability({
          name: 'Chainsaw',
          organisation,
          user,
        }),
        Creators.group({
          name: groupName,
          user,
          organisation,
        }).then((group) => {
          Promise.all([
            Creators.tag({
              name: 'Sample Tag',
              organisation,
              user,
              group,
            }),
            Creators.event({
              name: `Rescue of ${faker.name.jobType()}`,
              details: faker.hacker.phrase(),
              group,
            }).then((event) => {
              Creators.eventResponse({
                status: 'Responding',
                detail: 'ETA 10 min',
                destination: 'Scene',
                eta: nowInUTC() + 600,
                event,
                user,
              });
            }),
            Creators.schedule({
              name: `Team needed to ${faker.hacker.verb()} ${faker.hacker.noun()} in ${faker.address.city()}`,
              details: faker.hacker.phrase(),
              startTime: nowInUTC(),
              // one week away
              endTime: nowInUTC() + 604800,
              group,
            }),
            Creators.schedule({
              name: 'All member availability}',
              details: faker.hacker.phrase(),
              startTime: 0,
              endTime: distantFuture,
              group,
            }).then((schedule) => {
              Creators.timeSegment({
                status: 'Available',
                startTime: nowInUTC() + 3600, // +1 hr
                endTime: nowInUTC() + (3600 * 2), // +2 hr
                schedule,
                user,
              });
            }),
          ]);
        }),
      ]);
    });
    generateTestUser(Creators, organisation).then(() => {
      Promise.all([
      // bulk create X users, starting at id 100
        Array(20).fill().map((_, i) => addTestUserAndGroup(
          100 + i,
          faker.name.findName(),
          faker.internet.email(),
          `${faker.address.city()} Unit`,
        )),

      ]).then((users) => {
      // add all users to State Group
        users.forEach((index, element) => {
          models.Group.findOne({ where: { name: 'State Group' } }).then((group) => {
            group.addUser(element);
          });
        });
      });
    });
  });

export default loadTestData;
