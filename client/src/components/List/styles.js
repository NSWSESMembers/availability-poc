import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
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
  containerWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    borderRadius: 2,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 6,
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  supertitleText: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12,
    color: '#6B6B6B',
  },
  subtitleText: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12,
    color: '#6B6B6B',
  },
  titleText: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    marginRight: 8,
  },
  titleTextBold: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    marginRight: 8,
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
  },
  iconHolder: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  detailText: {
    fontStyle: 'italic',
  },
});

export default styles;
