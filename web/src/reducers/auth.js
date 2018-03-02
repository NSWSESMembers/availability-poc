export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid,
      };
    case 'LOGOUT':
      return {};
    case 'SET_CURRENT_USER':
      return { ...action.user };
    default:
      return state;
  }
};
