import Creators from './creators';

export const loadTestData = () =>
  Creators.organisation({
    name: 'NSW SES',
  }).then(organisation =>
    Promise.all([
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
          }),
        ]),
        ),
      ),
      Creators.user({
        id: 69,
        username: 'chris',
        password: 'testing',
        email: 'test@miceli.net.au',
        organisation,
      }).then(user =>
        Promise.all([
          Creators.user({
            id: 70,
            username: 'tim',
            password: '123',
            email: 'tim@tim.com',
            organisation,
          }),
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
            }).then(schedule =>
              Creators.timeSegment({
                status: 'Available',
                startTime: 1511853428,
                endTime: 1511854428,
                schedule,
                user,
              }),
            ),
            Creators.schedule({
              group,
              name: 'Wollongong VR',
              details: 'Weekly VR availability',
            }),
            Creators.schedule({
              group,
              name: 'Emergency Services Expo',
              details: '5 people needed for demonstrations on Sunday',
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
    ]),
  );

export default loadTestData;
