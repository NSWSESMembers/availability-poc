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
  it('should return test devic uuid', done => {
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
      query: "{user {organisation {name} }}"
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
});
