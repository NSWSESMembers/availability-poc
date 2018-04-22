import PropTypes from 'prop-types';
import React from 'react';
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
  headerRight: <ButtonNavBar onPress={() => console.log('call soc')} icon="phone" />,
});

EditResponse.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

export default EditResponse;
