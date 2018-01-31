import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  textStyleSecondary: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: '#f48603',
    width: '100%',
  },
  buttonStyleSecondary: {
    padding: 10,
    backgroundColor: '#1c87c9',
    width: '100%',
  },
  buttonNavBarIcon: {
    marginRight: 10,
    color: '#FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  buttonRowTitle: {
    fontSize: 11,
    fontWeight: '900',
    paddingTop: 5,
  },
  buttonRowDescription: {
    paddingBottom: 5,
  },
});

export default styles;
