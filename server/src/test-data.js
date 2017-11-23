import Creators from './creators';

export const loadTestData = () =>
  Creators.organisation({
    name: 'NSW SES',
  }).then(organisation =>
    Creators.user({
      id: 69,
      username: 'chris',
      password: 'testing',
      email: 'test@miceli.net.au',
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
          name: 'Wollongong',
          organisation,
          user,
        }).then(group => Promise.all([
          Creators.schedule({
            group,
            name: 'Wollongong S&W',
            details: 'Weekly storm availability',
          }),
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
          }),
          Creators.event({
            name: 'Assist ASNSW',
            details: 'Needed to carry patient over rough terrain',
            group,
          }),
        ])),
      ]),
    ),
  );

export default loadTestData;
