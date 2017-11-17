import { query, itReturnsSuccess } from './common';

// when not authenticated this just returns a dummy device for testing
describe('GraphQL query - Current device', () => {
  describe('Load it', () => {
    const response = query(`
      {
        device {
          uuid
        }
      }
    `);

    itReturnsSuccess(response);
  });
});
