import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: Colors.txtWhite,
    textAlign: 'center',
  },
  textStyleSecondary: {
    fontSize: 20,
    color: Colors.txtWhite,
    textAlign: 'center',
  },
  textStyleBox: {
    textAlign: 'center',
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: Colors.bgBtn,
    width: '100%',
  },
  buttonStyleSecondary: {
    padding: 10,
    backgroundColor: Colors.bgBtnSecondary,
    width: '100%',
  },
  buttonStyleBox: {
    padding: 10,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
  },
  buttonNavBarIcon: {
    marginRight: 10,
    color: Colors.txtWhite,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  buttonRowTitle: {
    fontSize: 11,
    fontWeight: '900',
    paddingTop: 5,
  },
  buttonRowDescription: {
    paddingBottom: 5,
  },
});

export default styles;
