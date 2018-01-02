import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 45,
  },
  barLeft: {
    width: 75,
  },
  barCentre: {
    flex: 1,
  },
  barRight: {
    width: 75,
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 20,
  },
  text: {
    color: Colors.txtWhite,
    fontWeight: '700',
  },
  icon: {
    color: Colors.txtWhite,
  },
  btnback: {
    marginLeft: 10,
    marginTop: 20,
  },
});

export default styles;
