import { StackNavigator } from 'react-navigation';

import Index from './Index';
import Detail from './Detail';
import Edit from './Edit';
import Requests from './Requests';
import NavOptions from '../../config/NavOptions';

const StackHome = StackNavigator(
  {
    Index: {
      screen: Index,
    },
    Detail: {
      screen: Detail,
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
