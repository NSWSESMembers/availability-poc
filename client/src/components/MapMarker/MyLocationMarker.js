import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';
import { Marker } from 'react-native-maps';

import styles from './styles';


const ANCHOR = { x: 0.5, y: 0.5 };

const MyLocationMarker = ({ myPosition }) => {
  // const rotate = (typeof myPosition.heading === 'number' && myPosition.heading >= 0) ?
  // `${myPosition.heading}deg` : null; //disabled due to heading bug in library
  const rotate = null; // dont draw heading

  if (!myPosition || !myPosition.latitude || !myPosition.longitude) return null;


  return (
    <Marker
      anchor={ANCHOR}
      style={styles.mapMarker}
      coordinate={myPosition}
    >
      <View style={styles.myMarkercontainer}>
        <View style={styles.markerHalo} />
        {rotate &&
        <View style={[styles.heading, { transform: [{ rotate }] }]}>
          <View style={styles.headingPointer} />
        </View>
          }
        <View style={styles.marker}>
          <Text style={{ width: 0, height: 0 }}>
            {rotate}
          </Text>
        </View>
      </View>
    </Marker>
  );
};

MyLocationMarker.propTypes = {
  myPosition: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    heading: PropTypes.number,
  }),
};
export default MyLocationMarker;
