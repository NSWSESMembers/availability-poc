import { itReturnsSuccessSync, itReturnsSuccess, itReturnsFailureSync, run, query } from './common';

describe('Get users group by passing filter', () => {
  const response = query(`
    {
      user {
        id
        groups(id: 2) {
          id
          schedules {
            id
          }
          events {
            id
          }
          tags {
            id
          }
        }
      }
    }
  `);

  itReturnsSuccess(response);
  it('Returns correct single entity', () => response.then((res) => {
    expect(res.data.user.groups.length).toBe(1);
    expect(res.data.user.groups[0]).toHaveProperty('id');
    expect(res.data.user.groups[0].id).toBe(2);
    expect(res.data.user.groups[0].id).not.toBe(1);
  }));
});

describe('Manipulate user group membership - join, join again, leave', async () => {
  const joinresponse = await run(
    {
      query: `
      mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
        addUserToGroup(groupUpdate: $groupUpdate) {
          id
          name
          tags {
             name
             id
           }
           users {
             username
             id
           }
        }
      }
      `,
      variables: {
        groupUpdate: {
          groupId: 3,
        },
      },
    },
  );

  itReturnsSuccessSync(joinresponse);

  const joinagainresponse = await run(
    {
      query: `
      mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
        addUserToGroup(groupUpdate: $groupUpdate) {
          id
          name
          tags {
             name
             id
           }
           users {
             username
             id
           }
        }
      }
      `,
      variables: {
        groupUpdate: {
          groupId: 3,
        },
      },
    },
  );

  itReturnsFailureSync(joinagainresponse);

  const leaveresponse = await run(
    {
      query: `
      mutation removeUserFromGroup($groupUpdate: RemoveUserFromGroupInput!) {
        removeUserFromGroup(groupUpdate: $groupUpdate)
      }
      `,
      variables: {
        groupUpdate: {
          groupId: 3,
        },
      },
    },
  );

  itReturnsSuccessSync(leaveresponse);

  it('leaving should return true', () => {
    expect(leaveresponse.data.removeUserFromGroup).toEqual(true);
  });
});
