import { StyleSheet } from 'react-native';

const SIZE = 15;
const HALO_RADIUS = 4;
const ARROW_SIZE = 7;
const ARROW_DISTANCE = 6;
const HALO_SIZE = SIZE + HALO_RADIUS;
const HEADING_BOX_SIZE = HALO_SIZE + ARROW_SIZE + ARROW_DISTANCE;

const colorOfmyLocationMapMarker = 'blue';


const styles = StyleSheet.create({

  circle: {
    width: 30,
    height: 30,
    borderRadius: 100 / 2,
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    alignSelf: 'flex-start',
    backgroundColor: '#5A6DFF',
    opacity: 0.8,
    padding: 1,
    borderRadius: 3,
    borderColor: '#161AF9',
    borderWidth: 0.5,
  },
  name: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 10,
  },
  destination: {
    color: '#FFFFFF',
    fontSize: 8,
    alignSelf: 'center',
  },
  locationTime: {
    color: '#FFFFFF',
    fontSize: 6,
    alignSelf: 'center',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  mapMarker: {
    zIndex: 1000, // onto of everthing
  },
  // The container is necessary to protect the markerHalo shadow from clipping
  myMarkercontainer: {
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
  },
  heading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
    alignItems: 'center',
  },
  headingPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: ARROW_SIZE * 0.75,
    borderBottomWidth: ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE * 0.75,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colorOfmyLocationMapMarker,
    borderLeftColor: 'transparent',
  },
  markerHalo: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    left: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: Math.ceil(HALO_SIZE / 2),
    margin: (HEADING_BOX_SIZE - HALO_SIZE) / 2,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  marker: {
    justifyContent: 'center',
    backgroundColor: colorOfmyLocationMapMarker,
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HEADING_BOX_SIZE - SIZE) / 2,
  },
  arrowBorderBlack: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: 'black',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default styles;
