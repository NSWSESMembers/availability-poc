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
    const addTestUserAndGroup = (id, username, email, org, groupName) => Creators.user({
      id,
      username,
      password: 'test123',
      email,
      organisation,
    }).then((user) => {
      Creators.group({
        name: groupName,
        user,
        organisation,
      }).then((group) => {
        Creators.event({
          name: `Rescue of ${faker.name.jobType()}`,
          details: faker.hacker.phrase(),
          group,
        });
        Creators.schedule({
          name: `Team needed to ${faker.hacker.verb()} ${faker.hacker.noun()} in ${faker.address.city()}`,
          details: faker.hacker.phrase(),
          startTime: nowInUTC(),
          // one day to one week away
          endTime: nowInUTC() + Math.floor(Math.random() * 604800) + 86400,
          group,
        });
        Creators.schedule({
          name: 'All member availability}',
          details: faker.hacker.phrase(),
          startTime: 0,
          endTime: distantFuture,
          group,
        });
      });
      return user;
    });


    Promise.all([
      addTestUserAndGroup(69, 'Test User', 'test@example.com', organisation, 'State Group'),
      // bulk create X users
      Array(20).fill().map((_, i) => {
        addTestUserAndGroup(100 + i, faker.name.findName(), faker.internet.email(), organisation, `${faker.address.city()} Unit`);
      }),
    ]).then((users) => {
      // add all users to State Group
      users.forEach((index, element) => {
        models.Group.findOne({ where: { name: 'State Group' } }).then((group) => {
          group.addUser(element);
        });
      });
    });
  });

export default loadTestData;
