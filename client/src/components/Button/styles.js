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
  textStyleDisabled: {
    fontSize: 20,
    color: Colors.txtDark,
    textAlign: 'center',
  },
  textStyleBox: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtextStyleBox: {
    textAlign: 'center',
  },
  iconStyleBox: {
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
  buttonStyleDisabled: {
    padding: 10,
    backgroundColor: Colors.bgDisabled,
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
  buttonIconContainer: {
    backgroundColor: 'green',
    alignItems: 'center',
    minHeight: 150,
    minWidth: 150,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    flexGrow: 1,
  },
  buttonIconText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default styles;
