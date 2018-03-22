import { MainScreenNavigator } from '../navigation';

const firstAction = MainScreenNavigator.router.getActionForPathAndParams('Home');
const tempNavState = MainScreenNavigator.router.getStateForAction(firstAction);
const initialNavState = MainScreenNavigator.router.getStateForAction(tempNavState);

const navigation = (state = initialNavState, action) => {
  let nextState;
  let customAction;
  switch (action.type) {
    case 'GO_TO_EVENT':
      // reset to initial state - re-visit later
      customAction = {
        type: 'Navigation/NAVIGATE',
        routeName: 'Event',
        params: {
          id: action.id,
        },
      };
      nextState = MainScreenNavigator.router.getStateForAction(customAction, initialNavState);
      break;
    case 'GO_TO_REQUEST':
      // reset to initial state - re-visit later
      customAction = {
        type: 'Navigation/NAVIGATE',
        routeName: 'Detail',
        params: {
          id: action.id,
        },
      };
      nextState = MainScreenNavigator.router.getStateForAction(customAction, initialNavState);
      break;
    default:
      nextState = MainScreenNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};

export default navigation;
