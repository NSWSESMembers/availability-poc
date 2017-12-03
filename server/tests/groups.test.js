import { itReturnsSuccess, run, query } from './common';

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

describe('Manipulate user group membership - leave', () => {
  const response = run(
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

  itReturnsSuccess(response);
  it('should return true', () => response.then((res) => {
    expect(res.data.removeUserFromGroup).toEqual(true);
  }));
});

describe('Manipulate user group membership - join', () => {
  const response = run(
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

  itReturnsSuccess(response);
  it('should contain joined group', () => response.then((res) => {
    expect(res.data.addUserToGroup).toHaveProperty('name');
    expect(res.data.addUserToGroup.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 69,
        }),
      ]),
    );
  }));
});
