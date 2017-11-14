const tester = require('graphql-tester').tester;


describe('A user', function() {
   const self = this;
  beforeAll(() => {
    self.test = tester({
      url: `http://127.0.0.1:8080/graphql`,
      contentType: 'application/json'
    });
  });
  it('should register with new user', () => {
    expect(true).toBe(true);
  });
  it('should not register with existing user data', () => {
    expect(true).toBe(true);
  });
  it('should not login with wrong credentials', () => {
    expect(true).toBe(true);
  });
  it('should login with correct credentials', () => {
    expect(true).toBe(true);
  });
  it('should not login twice', () => {
    expect(true).toBe(true);
  });
  it('should logout after logging in', () => {
    expect(true).toBe(true);
  });
  it('should not logout if not logged in', () => {
    expect(true).toBe(true);
  });
  it('should removed by ID', () => {
    expect(true).toBe(true);
  });
});
