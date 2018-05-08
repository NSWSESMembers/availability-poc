import { StyleSheet } from 'react-native';

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
});

export default styles;
