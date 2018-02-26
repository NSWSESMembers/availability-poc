export const login = uid => ({
  type: 'LOGIN',
  uid,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const setCurrentUser = user => ({
  type: 'SET_CURRENT_USER',
  user,
});
