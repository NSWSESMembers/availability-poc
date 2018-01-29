import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  default: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    color: '#1e3c78',
    fontWeight: '700',
    fontSize: 20,
    flex: 1,
  },
  defaultHolder: {
    borderBottomWidth: 0.5,
    borderColor: '#797979',
    marginBottom: 25,
    width: '100%',
  },
  defaultText: {
    color: '#1e3c78',
    fontWeight: '700',
  },
  inputHolder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
