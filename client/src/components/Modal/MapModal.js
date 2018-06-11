import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { IconMarker } from '../../components/MapMarker/';
import MapDelta from '../../selectors/MapDelta';

import styles from './styles';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MapModal extends Component {
  zoomMap = () => {
    if (this.props.initialRegion) {
      this.map.animateToRegion(
        MapDelta(
          this.props.initialRegion.locationLatitude,
          this.props.initialRegion.locationLongitude,
          2000, // 2000m height
        ),
      );
    }
  }

  render() {
    return (
      <View>
        <Modal
          transparent
          visible={this.props.visible}
          onRequestClose={this.props.closeModal}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={this.props.closeModal}>
            <View style={styles.overlayStyle}>
              <View style={styles.headerContainer}>
                <TouchableOpacity>
                  <View style={styles.headerStyle}>
                    <Text style={styles.headerTextStyle}>{this.props.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.mapContainer}>
                <View>
                  <View>
                    {/* TouchableWithoutFeedback prevents touch propagation */}
                    <TouchableWithoutFeedback>
                      <MapView
                        onMapReady={this.zoomMap}
                        ref={(ref) => {
                          this.map = ref;
                        }}
                        initialRegion={{
                          latitude: this.props.initialRegion.locationLatitude || 0,
                          longitude: this.props.initialRegion.locationLongitude || 0,
                          latitudeDelta: LATITUDE_DELTA,
                          longitudeDelta: LONGITUDE_DELTA,
                       }}
                        // TODO Dynamic height
                        style={{ height: Dimensions.get('window').height - 250 }}
                      >
                        {this.props.markers.map(marker => (
                          <Marker
                            key={`marker${marker.id}`}
                            coordinate={marker}
                            style={{ zIndex: 1, opacity: 0.9 }}
                          >
                            <IconMarker
                              name={marker.icon}
                            />
                          </Marker>
                        ))}
                      </MapView>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
              <View style={styles.cancelContainer}>
                <TouchableOpacity onPress={this.props.backModal}>
                  <View style={styles.cancelStyle}>
                    <Text style={styles.cancelTextStyle}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}


MapModal.propTypes = {
  title: PropTypes.string.isRequired,
  markers: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  initialRegion: PropTypes.shape({
    locationLatitude: PropTypes.number,
    locationLongitude: PropTypes.number,
  }),
  closeModal: PropTypes.func.isRequired,
  backModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default MapModal;
