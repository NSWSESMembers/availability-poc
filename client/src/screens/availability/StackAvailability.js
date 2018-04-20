import { StackNavigator } from 'react-navigation';

import Index from './Index';
import Detail from './Detail';
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
