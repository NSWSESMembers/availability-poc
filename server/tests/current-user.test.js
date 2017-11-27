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
            capabilities {
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
    it('Returns capabilities', () => response.then((res) => {
      expect(res.data.user.organisation.capabilities.length).toBeGreaterThan(0);
      expect(res.data.user.organisation.capabilities[0]).toHaveProperty('id');
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
            responses {
              status
              event {
                id
              }
              user {
                id
              }
            }
          }
        }
      }
    `);

    itReturnsSuccess(response);
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

  describe('Get capabilities', () => {
    const response = query(`
      {
        user {
          id
          capabilities {
            id
          }
        }
      }
    `);

    itReturnsSuccess(response);
  });
});
