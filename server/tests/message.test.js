import { query, itReturnsSuccess } from './common';

// this query is made as the default user
describe('GraphQL query - event message', () => {
  describe('Messages by event ID', () => {
    const response = query(`
      {
        event(id: 1) {
          id
          messages {
            id
            text
            edited
            image
            user {
              id
              username
              displayName
            }
            createdAt
          }
        }
      }
    `);

    itReturnsSuccess(response);
    it('Returns at least one message', () => response.then((res) => {
      expect(res.data.event.messages.length).toBeGreaterThanOrEqual(1);
      expect(res.data.event.messages[0]).toHaveProperty('id');
      expect(res.data.event.messages[0]).toHaveProperty('text');
    }));
  });
});
