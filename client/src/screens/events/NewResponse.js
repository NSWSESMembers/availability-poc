import PropTypes from 'prop-types';
import React from 'react';

import { ButtonNavBar } from '../../components/Button';
import { SetResponse } from '../../components/Events';

const NewResponse = ({ navigation }) => {
  const { params } = navigation.state;

  const onClose = () => {
    navigation.pop();
  };

  return (
    <SetResponse
      eventId={params.eventId}
      onClose={onClose}
    />
  );
};

NewResponse.navigationOptions = () => ({
  title: 'NEW EVENT',
  headerRight: <ButtonNavBar onPress={() => console.log('call soc')} icon="exclamation-triangle" />,
});

NewResponse.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

export default NewResponse;
