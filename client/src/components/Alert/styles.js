import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const bottom = -100;
const styles = StyleSheet.create({
  holder: {
    left: 25,
    right: 25,
    position: 'absolute',
    bottom,
    zIndex: 1,
    padding: 20,
    paddingTop: 15,
    borderRadius: 5,
    backgroundColor: Colors.bgWhite,
  },
  titleHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  message: {
    marginTop: 5,
  },
});

export default styles;
