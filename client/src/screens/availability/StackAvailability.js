import { StackNavigator } from 'react-navigation';

import Index from './Index';
import Edit from './Edit';
import Requests from './Requests';
import NavOptions from '../../config/NavOptions';

const StackHome = StackNavigator(
  {
    Index: {
      screen: Index,
    },
    Edit: {
      screen: Edit,
    },
    Requests: {
      screen: Requests,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default StackHome;
