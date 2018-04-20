import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonNavBar } from '../../components/Button';
import { SetResponse } from '../../components/Events';

const EditResponse = ({ navigation }) => {
  const { params } = navigation.state;

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <SetResponse
      eventId={params.eventId}
      onClose={onClose}
    />
  );
};

EditResponse.navigationOptions = () => ({
  title: 'Event Response',
  tabBarLabel: 'Events',
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => <Icon size={26} name="bullhorn" color={tintColor} />,
  headerRight: <ButtonNavBar onPress={() => console.log('call soc')} icon="phone" />,
});

EditResponse.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

export default EditResponse;
