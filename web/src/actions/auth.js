export const login = uid => ({
  type: 'LOGIN',
  uid,
});

export const startLogin = () => () => console.log('startlogin'); // firebase.auth().signInWithPopup(googleAuthProvider);

export const logout = () => ({
  type: 'LOGOUT',
});

export const startLogout = () => () => console.log('startLogout'); // firebase.auth().signOut();

export const setCurrentUser = user => ({
  type: 'SET_CURRENT_USER',
  user,
});
