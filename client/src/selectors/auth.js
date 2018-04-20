/*
  helpers for determining authentication state
*/

// we use this to determine whether the auth information we have appears to be valid
// note that just because it looks valid to us doesn't mean the server agrees - the user's JWT
// could have been invalidated on the server side.
// eslint-disable-next-line import/prefer-default-export
export const isLoggedIn = auth => (
  // this function is intended to take the auth prop that is passed in via redux
  // if username is set then we're considered logged in
  !!auth.username
);
