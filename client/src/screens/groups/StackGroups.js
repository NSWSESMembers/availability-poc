import { StackNavigator } from 'react-navigation';

import Index from './Index';
import GroupDetails from './GroupDetails';
import NewGroup from './NewGroup';
import SearchGroup from './SearchGroup';
import NavOptions from '../../config/NavOptions';

const StackGroups = StackNavigator(
  {
    Groups: {
      screen: Index,
    },
    Group: {
      screen: GroupDetails,
    },
    SearchGroup: {
      screen: SearchGroup,
    },
    NewGroup: {
      screen: NewGroup,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

export default StackGroups;
