const tester = require('graphql-tester').tester;


describe('GraphQL Queries', function() {
 const self = this;
 beforeAll(() => {
  self.test = tester({
      url: `http://127.0.0.1:8080/graphql`,
      contentType: 'application/json'
    });
});
 it('should return test user', done => {
  self
  .test(
    JSON.stringify({
      query: "{user {username}}"
    }),
    )
  .then(res => {
    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    done();
  })
  .catch(err => {
    expect(err).toBe(null);
    done();
  });
});
  it('should return test device uuid', done => {
  self
  .test(
    JSON.stringify({
      query: "{user {devices {uuid} }}"
    }),
    )
  .then(res => {
    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    done();
  })
  .catch(err => {
    expect(err).toBe(null);
    done();
  });
});
 it('should return test user organisation', done => {
  self
  .test(
    JSON.stringify({
      query: "{user {organisation {id name tags {id name} capabilities {id name}} }}"
    }),
    )
  .then(res => {
    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    done();
  })
  .catch(err => {
    expect(err).toBe(null);
    done();
  });
});
 it('should return test users groups', done => {
  self
  .test(
    JSON.stringify({
      query: "{user {groups {name} tags { name } capabilities { name } }}"
    }),
    )
  .then(res => {
    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    done();
  })
  .catch(err => {
    expect(err).toBe(null);
    done();
  });
});
 it('should return test users groups', done => {
  self
  .test(
    JSON.stringify({
      query: "{user {groups {name} }}"
    }),
    )
  .then(res => {
    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    done();
  })
  .catch(err => {
    expect(err).toBe(null);
    done();
  });
});
  it('should create a new user', done => {
    self
      .test(
        JSON.stringify({
          query: `mutation signup($user: SignupInput!) {
                    signup(user: $user) {
                      id
                      email
                      username
                      authToken
                    }
                  }`,
          variables: {
            user: {
              username: 'test-user',
              email: 'test@domain.tld',
              password: 'moo-moo',
              deviceId: "1234-1234-1234-1234"
            }
          }
        }),
      )
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
  it('should delete the new user', done => {
    self
      .test(
        JSON.stringify({
          query: `mutation deleteUser($user: DeleteUserInput!) {
                    deleteUser(user: $user) {
                      username
                    }
                  }`,
          variables: {
            user: {
              username: 'test-user',
              email: 'test@domain.tld',
            }
          }
        }),
      )
      .then(res => {
        console.log(res)
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch(err => {
        expect(err).toBe(null);
        done();
      });
  });
});
