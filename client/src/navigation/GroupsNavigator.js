import { StackNavigator } from 'react-navigation';

import { Root, GroupDetails, SearchGroup, NewGroup } from '../screens/groups';
import NavOptions from '../config/NavOptions';

const GroupsNavigator = StackNavigator(
  {
    Groups: {
      screen: Root,
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

export default GroupsNavigator;
