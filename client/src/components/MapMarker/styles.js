import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    alignSelf: 'flex-start',
    backgroundColor: '#5A6DFF',
    opacity: 0.8,
    padding: 2,
    borderRadius: 3,
    borderColor: '#161AF9',
    borderWidth: 0.5,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  destination: {
    color: '#FFFFFF',
    fontSize: 9,
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
});

export default styles;
