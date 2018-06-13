import { StyleSheet } from 'react-native';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    flexShrink: 1,
    marginTop: 8,
    marginBottom: 8,
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  cancelContainer: {
    alignSelf: 'stretch',
  },

  nextContainer: {
    alignSelf: 'stretch',
  },


  headerContainer: {
    alignSelf: 'stretch',
  },

  selectStyle: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: PADDING,
    borderRadius: BORDER_RADIUS,
  },

  selectTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  headerStyle: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },

  headerTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  headerSubTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE - 4,
  },

  etaInput: {
    height: 100,
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },

  nextStyle: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
    marginBottom: 8,
  },

  nextTextStyle: {
    textAlign: 'center',
    color: 'green',
    fontSize: FONT_SIZE,
  },

  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },

  cancelTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  optionStyle: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionIconStyle: {
    textAlign: 'center',
  },
  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR,
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
  },

  mapContainer: {
    borderRadius: BORDER_RADIUS,
    flexShrink: 1,
    marginTop: 8,
    marginBottom: 8,
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  map: {
    backgroundColor: '#f9f9f9',
    zIndex: -1,
    height: 200,
  },
});

export default styles;
