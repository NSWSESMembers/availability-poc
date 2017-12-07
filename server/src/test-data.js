import Creators from './creators';

const nowInUTC = () => {
  const d = new Date();
  return Math.round(d.getTime() / 1000);
};

export const loadTestData = () =>
  Creators.organisation({
    name: 'NSW SES',
  }).then(organisation =>
    Promise.all([
      Creators.user({
        id: 69,
        username: 'test',
        password: 'test',
        email: 'test@example.com',
        organisation,
      }).then(user =>
        Promise.all([
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
          Creators.group({
            name: 'Kiama',
            user,
            organisation,
          }),
          Creators.group({
            name: 'Wollongong',
            organisation,
            user,
          }).then(group => Promise.all([
            Creators.schedule({
              group,
              name: 'Wollongong S&W',
              details: 'Weekly storm availability',
              startTime: 0, // ongoing
              endTime: 0, // ongoing
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
              endTime: 0, // ongoing
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
              Creators.eventResponse({
                status: 'On Route',
                detail: 'Attending',
                destination: 'Scene',
                eta: 1517443200,
                event,
                user,
              }),
            ),
            Creators.event({
              name: 'Assist ASNSW',
              details: 'Needed to carry patient over rough terrain',
              group,
            }),
          ])),
        ]),
      ),
      Creators.user({
        id: 68,
        username: 'tim',
        password: '123',
        email: 'test@test.com',
        organisation,
      }).then(user =>
        Creators.group({
          name: 'SWR Flood Rescue Techs',
          user,
          organisation,
        }).then(group => Promise.all([
          Creators.schedule({
            group,
            name: 'SWR FR Roster',
            details: 'SWR FR availability',
            startTime: 0, // ongoing
            endTime: 0, // ongoing
          }),
        ]),
        ),
      ),
    ]),
  );

export default loadTestData;
