import { StackNavigator } from 'react-navigation';

import { Root, Profile } from '../screens/burger';
import NavOptions from '../config/NavOptions';

const BurgerNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    Profile: {
      screen: Profile,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default BurgerNavigator;
