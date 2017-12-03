import { query, itReturnsSuccess } from './common';

// this query is made as the default user
describe('GraphQL query - Event', () => {
  describe('Event by ID', () => {
    const response = query(`
      {
        event(id: 1) {
          id
          name
          details
          group {
            id
          }
          responses {
            user {
              username
            }
            detail
          }
        }
      }
    `);

    itReturnsSuccess(response);
    it('Returns id', () =>
      expect(response).resolves.toHaveProperty('data.event.id'),
    );
    it('Returns name', () =>
      expect(response).resolves.toHaveProperty('data.event.name'),
    );
  });
});
