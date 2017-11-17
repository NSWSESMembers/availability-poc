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
            timeSegments {
              schedule {
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
