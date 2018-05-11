import React from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-native-maps';

const AccuracyHalo = ({ myPosition }) => {
  if (
    !myPosition ||
    !myPosition.latitude ||
    !myPosition.longitude ||
    !myPosition.accuracy
  ) return null;


  return (
    <Circle
      key="myPositionHalo"
      center={myPosition}
      radius={myPosition.accuracy}
      strokeColor="transparent"
      fillColor="rgba(135,206,250,0.3)"
    />
  );
};

AccuracyHalo.propTypes = {
  myPosition: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    heading: PropTypes.number,
    accuracy: PropTypes.number,
  }),
};

export default AccuracyHalo;
