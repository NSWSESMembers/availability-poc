import { StackNavigator } from 'react-navigation';

import Index from './Index';
import NavOptions from '../../config/NavOptions';

const StackHome = StackNavigator(
  {
    Home: {
      screen: Index,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default StackHome;
