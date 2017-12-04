import { itReturnsSuccess, itReturnsFailure, run, query } from './common';

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
describe('Manipulate user group membership - leave, join, join again', () => {
  const leaveresponse = run(
    {
      query: `
      mutation removeUserFromGroup($groupUpdate: RemoveUserFromGroupInput!) {
        removeUserFromGroup(groupUpdate: $groupUpdate)
      }
      `,
      variables: {
        groupUpdate: {
          groupId: 2,
        },
      },
    },
  );

  itReturnsSuccess(leaveresponse);
  it('leaving should return true', () => leaveresponse.then((res) => {
    expect(res.data.removeUserFromGroup).toEqual(true);
  }));
  const joinresponse = run(
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
          groupId: 2,
        },
      },
    },
  );

  itReturnsSuccess(joinresponse);
  it('joining again should fail', () => joinresponse.then((res) => {
    expect(res.data.addUserToGroup).toHaveProperty('name');
    expect(res.data.addUserToGroup.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 69,
        }),
      ]),
    );
  }));
  const joinagainresponse = run(
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
          groupId: 2,
        },
      },
    },
  );

  itReturnsFailure(joinagainresponse);
});
