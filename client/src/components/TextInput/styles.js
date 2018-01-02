import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  default: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    color: Colors.txtWhite,
    fontWeight: '700',
    fontSize: 24,
    flex: 1,
  },
  defaultHolder: {
    borderBottomWidth: 1,
    borderColor: Colors.bdWhite,
    marginBottom: 25,
  },
  defaultText: {
    color: Colors.txtWhite,
    fontWeight: '700',
  },
  inputHolder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validIcon: {
    color: Colors.txtWhite,
    paddingLeft: 10,
  },
});

export default styles;
