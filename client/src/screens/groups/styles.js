import { StyleSheet } from 'react-native';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    borderRadius: 2,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  leaveGroupText: {
    fontSize: 7,
    includeFontPadding: false,
    flex: 0,
    color: '#6B6B6B',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12,
    color: '#6B6B6B',
  },
  iconRightHolder: {
    width: 50,
    paddingLeft: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  titleTextBold: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    marginRight: 8,
    fontWeight: 'bold',
  },
  iconLeftHolder: {
    width: 40,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  detailsContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  input: {
    fontSize: 12,
  },
  inputBorder: {
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 1,
  },
  inputInstructions: {
    paddingTop: 6,
    color: '#777',
    fontSize: 12,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selected: {
    flexDirection: 'row',
  },
  saveButton: {
    padding: 20,
  },
  navIcon: {
    color: 'blue',
    fontSize: 18,
    paddingTop: 2,
  },
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

  searchContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    marginTop: 8,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: PADDING,
  },

  searchbar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    flexShrink: 1,
    marginBottom: 8,
    marginTop: 8,
    height: '50%',
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  optionContainerTags: {
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    flexShrink: 1,
    marginBottom: 8,
    height: '50%',
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 5,
    height: 45,
    width: 45,
  },
  itemContainerSelected: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b8378',
    borderRadius: 5,
    padding: 5,
    height: 45,
    width: 45,
  },
});

export default styles;
