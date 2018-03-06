import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: Colors.bgLight,
  },
  containerAlt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgMain,
  },
  containerHolder: {
    width: '100%',
    backgroundColor: Colors.bgWhite,
    paddingLeft: 20,
    paddingRight: 20,
  },
  containerFooter: {
    height: 75,
    backgroundColor: Colors.bgWhite,
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
