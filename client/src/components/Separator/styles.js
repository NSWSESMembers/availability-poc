import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  separator: {
    backgroundColor: Colors.bgLight,
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  separatorClear: {
    backgroundColor: Colors.bgWhite,
    width: '100%',
    height: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
});

export default styles;
