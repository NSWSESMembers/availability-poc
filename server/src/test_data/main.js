import faker from 'faker';
import distantFuture from '../constants';

const nowInUTC = () => {
  const d = new Date();
  return Math.round(d.getTime() / 1000);
};

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
              name: 'Wollongong City',
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
    Promise.all([
      Creators.user({
        id: 69,
        username: 'test',
        password: 'test',
        email: 'test@example.com',
        organisation,
      }).then(user =>
        Promise.all([
          Creators.group({
            name: 'State Group',
            user,
            organisation,
          }).then(group => Promise.all([
            Creators.schedule({
              group,
              name: 'Wollongong S&W',
              details: 'Weekly storm availability',
              startTime: 0, // ongoing
              endTime: distantFuture, // ongoing
            }).then(schedule =>
              Creators.timeSegment({
                status: 'Available',
                startTime: nowInUTC() + 3600, // +1 hr
                endTime: nowInUTC() + (3600 * 2), // +2 hr
                schedule,
                user,
              }),
            ),
            Creators.schedule({
              group,
              name: 'Wollongong VR',
              details: 'Weekly VR availability',
              startTime: 0, // ongoing
              endTime: distantFuture, // ongoing
            }),
            Creators.schedule({
              group,
              name: 'Emergency Services Expo',
              details: '5 people needed for demonstrations on Sunday',
              startTime: 1512860400, // Sunday 10/12/17 @ 10am AEST in GMT
              endTime: 1512878400, // Sunday 10/12/17 @ 3pm AEST in GMT
            }),
            Creators.tag({
              name: 'Wollongong City',
              organisation,
              user,
              group,
            }),
            Creators.tag({
              name: 'Corrimal',
              organisation,
              user,
              group,
            }),
            Creators.event({
              name: 'VR Wollongong Escarpment',
              details: 'VR operators required to assist with rescue',
              group,
            }).then(event =>
              Promise.all([
                Creators.eventResponse({
                  status: 'Responding',
                  detail: 'ETA 10 min',
                  destination: 'Scene',
                  eta: 1517443200,
                  event,
                  user,
                }),
                Creators.eventResponse({
                  status: 'Responding',
                  detail: 'WOL39',
                  destination: 'Scene',
                  eta: 1517443200,
                  event,
                  user,
                }),
                Creators.eventResponse({
                  status: 'Unavailable',
                  detail: 'At work',
                  destination: '',
                  eta: 1517443200,
                  event,
                  user,
                }),
              ]),
            ),
          ])),
          Creators.device({
            uuid: '1234abc',
            user,
          }),
          Creators.capability({
            name: 'Road Crash Rescue',
            organisation,
            user,
          }),
          Creators.capability({
            name: 'Vertical Rescue',
            organisation,
            user,
          }),
          Creators.capability({
            name: 'Flood Rescue',
            organisation,
            user,
          }),
          Creators.capability({
            name: 'Chainsaw',
            organisation,
            user,
          }),
        ]),
      ),
    ]).then(() => {
      Promise.all([
      // bulk create X users
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
