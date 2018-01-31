import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  default: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    color: Colors.bgMain,
    fontWeight: '700',
    fontSize: 20,
    flex: 1,
  },
  defaultHolder: {
    borderBottomWidth: 0.5,
    borderColor: Colors.bdInput,
    marginBottom: 25,
    width: '100%',
  },
  defaultText: {
    color: Colors.bgMain,
    fontWeight: '700',
  },
  inputHolder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
