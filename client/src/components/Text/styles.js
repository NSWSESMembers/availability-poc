import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const h6 = { fontSize: 13 };
const h5 = { fontSize: 16 };
const h4 = { fontSize: 18 };
const h3 = { fontSize: 25 };
const h1 = { fontSize: 32 };
const styles = StyleSheet.create({
  default: {
    color: Colors.txtDark,
    fontSize: 16,
  },
  spanWhite: {
    color: Colors.txtWhite,
  },
  h6,
  h6White: {
    ...h6,
    color: Colors.txtWhite,
  },
  h5,
  h5White: {
    ...h5,
    color: Colors.txtWhite,
  },
  h4,
  h4White: {
    ...h4,
    color: Colors.txtWhite,
  },
  h3,
  h3White: {
    ...h3,
    color: Colors.txtWhite,
  },
  h1,
  h1White: {
    ...h1,
    color: Colors.txtWhite,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
