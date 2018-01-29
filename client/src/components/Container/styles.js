import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  containerAlt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c78',
  },
  containerHolder: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingLeft: 20,
    paddingRight: 20,
  },
  containerFooter: {
    height: 75,
    backgroundColor: '#FFF',
    width: '100%',
    flexDirection: 'row',
  },
  containerHalf: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
