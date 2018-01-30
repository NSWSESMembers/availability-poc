import { distantFuture, nowInUTC } from '../constants';

const generateTestUser = (Creators, organisation) =>
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
  ]);

export default generateTestUser;
