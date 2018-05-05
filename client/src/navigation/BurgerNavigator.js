import { StackNavigator } from 'react-navigation';

import { Root, Profile, Params } from '../screens/burger';
import NavOptions from '../config/NavOptions';

const BurgerNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    Profile: {
      screen: Profile,
    },
    Params: {
      screen: Params,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default BurgerNavigator;
