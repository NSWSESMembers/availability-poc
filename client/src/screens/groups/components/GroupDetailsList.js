import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  FlatList,
  Alert,
} from 'react-native';

import { Center, Container } from '../../../components/Container';

import EventListItem from '../../../components/Events/EventListItem';
import ScheduleListItem from '../../../components/Schedules/ScheduleListItem';
import UserListItem from '../../../components/Users/UserListItem';


const groupDetailsRenderItem = ({ item }) => {
  // eslint-disable-next-line no-underscore-dangle
  switch (item.__typename) { // GQL typename from Schema
    case 'User':
      return (
        <UserListItem
          user={item}
      // TODO: Deep link
          onPress={() => Alert.alert('PLACEHOLDER', 'Deeplink to user details')}
        />
      );
    case 'Schedule':
      return (
        <ScheduleListItem
          schedule={item}
    // TODO: Deep link
          onPress={() => Alert.alert('PLACEHOLDER', 'Deeplink to schedule details')}
        />
      );
    default:
      return (
        <EventListItem
          event={item}
    // TODO: Deep link
          onPress={() => Alert.alert('PLACEHOLDER', 'Deeplink to event details')}
        />
      );
  }
};

groupDetailsRenderItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object.isRequired,
};

const GroupDetailsList = ({ items, selectedIndex, networkStatus, refetch }) => (
  <Container>
    <FlatList
      data={items[selectedIndex]}
      ListHeaderComponent={() =>
        (!items[selectedIndex].length ? (
          <Center>
            <Text>Nothing here</Text>
          </Center>
        ) : null)}
      keyExtractor={item => item.id}
      renderItem={groupDetailsRenderItem}
      refreshing={networkStatus === 4}
      onRefresh={refetch}
    />
  </Container>
);

GroupDetailsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  networkStatus: PropTypes.number.isRequired,
  refetch: PropTypes.func,
};

export default GroupDetailsList;
