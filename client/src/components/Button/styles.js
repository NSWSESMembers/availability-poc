import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  default: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.bdWhite,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultText: {
    color: Colors.txtWhite,
    fontSize: 20,
  },
  btnSubmitHolder: {
    position: 'absolute',
    right: 25,
    bottom: 0,
    paddingBottom: 25,
  },
  submit: {
    backgroundColor: Colors.bgWhite,
    width: 50,
  },
  submitTxt: {
    color: Colors.txtMain,
  },
});

export default styles;
