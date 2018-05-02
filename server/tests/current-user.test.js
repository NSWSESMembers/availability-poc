import { query, itReturnsSuccess } from './common';

// load the current user (this only works because we return a dummy user
// when not authenticated for testing)

describe('GraphQL query - Current user', () => {
  describe('Get basic info', () => {
    const response = query(`{
        user {
          id
          username
          email
        }
      }`,
    );

    itReturnsSuccess(response);
    it('Return the basic information', () => response.then((res) => {
      expect(res.data.user).toHaveProperty('username');
    }));
  });

  describe('Get organisation', () => {
    const response = query(`
      {
        user {
          organisation {
            id
            name
            users {
              id
            }
            groups {
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
    it('Returns entity', () => response.then((res) => {
      expect(res.data.user.organisation).toHaveProperty('id');
      expect(res.data.user.organisation).toHaveProperty('name');
    }));
    it('Returns users', () => response.then((res) => {
      expect(res.data.user.organisation.users.length).toBeGreaterThan(0);
      expect(res.data.user.organisation.users[0]).toHaveProperty('id');
    }));
    it('Returns groups', () => response.then((res) => {
      expect(res.data.user.organisation.groups.length).toBeGreaterThan(0);
      expect(res.data.user.organisation.groups[0]).toHaveProperty('id');
    }));
    it('Returns tags', () => response.then((res) => {
      expect(res.data.user.organisation.tags.length).toBeGreaterThan(0);
      expect(res.data.user.organisation.tags[0]).toHaveProperty('id');
    }));
  });

  describe('Get organisations groups passing filter', () => {
    const response = query(`
      {
        user {
          organisation {
            id
            name
            groups(id: 1) {
              id
            }
          }
        }
      }
    `);

    itReturnsSuccess(response);
    it('Returns correct single group entity', () => response.then((res) => {
      expect(res.data.user.organisation.groups.length).toBe(1);
      expect(res.data.user.organisation.groups[0]).toHaveProperty('id');
      expect(res.data.user.organisation.groups[0].id).toBe(1);
    }));
  });

  describe('Get groups', () => {
    const response = query(`
      {
        user {
          id
          groups {
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
  });

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

  describe('Get schedules', () => {
    const response = query(`
      {
        user {
          id
          schedules {
            id
            name
            group {
              id
              name
            }
            timeSegments {
              endTime
              startTime
              status
              user {
                id
              }
            }
          }
        }
      }
    `);

    itReturnsSuccess(response);
    it('Returns entity', () => response.then((res) => {
      expect(res.data.user.schedules[0]).toHaveProperty('id');
      expect(res.data.user.schedules[0]).toHaveProperty('name');
    }));
    it('Returns group', () => response.then((res) => {
      expect(res.data.user.schedules[0].group).toHaveProperty('id');
      expect(res.data.user.schedules[0].group).toHaveProperty('name');
    }));
    it('Returns time segment block', () => response.then((res) => {
      expect(res.data.user.schedules[0]).toHaveProperty('timeSegments');
    }));
  });

  describe('Get events', () => {
    const response = query(`
      {
        user {
          id
          events {
            id
            name
            responses {
              status
              detail
              destination {
                id
                name
              }
              eta
              user {
                id
                username
              }
            }
          }
        }
      }
    `);

    itReturnsSuccess(response);
    it('Returns entity', () => response.then((res) => {
      expect(res.data.user.events[0]).toHaveProperty('id');
      expect(res.data.user.events[0]).toHaveProperty('name');
    }));
    it('Returns responses', () => response.then((res) => {
      expect(res.data.user.events[0].responses[0]).toHaveProperty('status');
      expect(res.data.user.events[0].responses[0]).toHaveProperty('detail');
      expect(res.data.user.events[0].responses[0]).toHaveProperty('destination');
      expect(res.data.user.events[0].responses[0]).toHaveProperty('eta');
      expect(res.data.user.events[0].responses[0].user).toHaveProperty('id');
      expect(res.data.user.events[0].responses[0].user).toHaveProperty('username');
    }));
  });

  describe('Get devices', () => {
    const response = query(`
      {
        user {
          id
          devices {
            id
            uuid
          }
        }
      }
    `);

    itReturnsSuccess(response);
  });

  describe('Get tags', () => {
    const response = query(`
      {
        user {
          id
          tags {
            id
          }
        }
      }
    `);

    itReturnsSuccess(response);
  });
});
