// eslint-disable-next-line import/no-extraneous-dependencies
import { tester } from 'graphql-tester';

const test = tester({
  url: 'http://127.0.0.1:8080/graphql',
  contentType: 'application/json',
});

export const run = json => (
  test(JSON.stringify(json))
);

export const query = q => run({ query: q });

export const itReturnsSuccess = (response) => {
  it('returns success', () => response.then((res) => {
    if (res.errors) {
      // eslint-disable-next-line no-console
      console.log(res.errors[0].message);
    }
    expect(res.success).toBe(true);
    expect(res.status).toBe(200);
  }));
};

export const itReturnsFailure = (response) => {
  it('returns failure', () => response.then((res) => {
    expect(res.success).not.toBe(true);
    expect(res.status).toBe(200);
  }));
};

export const itReturnsSuccessSync = (response) => {
  it('returns success', () => {
    if (response.errors) {
      // eslint-disable-next-line no-console
      console.log(response.errors[0].message);
    }
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
  });
};

export const itReturnsFailureSync = (response) => {
  it('returns failure', () => {
    expect(response.success).not.toBe(true);
    expect(response.status).toBe(200);
  });
};

export default run;
