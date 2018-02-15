export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid,
      };
    case 'LOGOUT':
      return {};
    case 'SET_CURRENT_USER':
      console.log('set current', action.user);
      return { ...action.user };
    // return state.merge(action.user);
    default:
      return state;
  }
};
