import { itReturnsSuccess, run } from './common';

describe('GraphQL Authentication', () => {
  afterAll(() => {
    // TODO: clean up created user
  });

  describe('perform signup', () => {
    const response = run(
      {
        query: `
          mutation signup($user: SignupInput!) {
            signup(user: $user) {
              id
              email
              username
              authToken
            }
          }
        `,
        variables: {
          user: {
            username: `test${Date.now()}`,
            email: `test${Date.now()}@domain.tld`,
            password: 'moo-moo',
            deviceUuid: '1234-1234-1234-1234',
          },
        },
      },
    );

    itReturnsSuccess(response);

    it('should contain authToken', () => response.then((res) => {
      expect(res).toHaveProperty('data.signup.authToken');
    }));
  });
});
