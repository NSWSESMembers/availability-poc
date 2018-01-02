import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const defaultStyle = {
  height: 50,
  borderRadius: 25,
  borderWidth: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  width: 50,
};

const styles = StyleSheet.create({
  normal: {
    ...defaultStyle,
    borderColor: Colors.bdWhite,
    backgroundColor: Colors.bgWhite,
  },
  disabled: {
    ...defaultStyle,
    borderColor: Colors.bdDisabled,
    backgroundColor: Colors.bgDisabled,
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
