import { itReturnsSuccess, run } from './common';

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
          groupId: 1,
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
          groupId: 1,
        },
      },
    },
  );

  itReturnsSuccess(response);
  it('should contain joined group', () => response.then((res) => {
    expect(res.data.addUserToGroup).toHaveProperty('name');
    expect(res.data.addUserToGroup.name).toBe('Kiama');
    expect(res.data.addUserToGroup.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 69,
        }),
      ]),
    );
  }));
});
