import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  responseContainer: {
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  responseText: {
    flex: 0.5,
  },
  buttonContainerTopRow: {
    flex: 0.5,
    flexDirection: 'row',
  },
  buttonContainerBottomRow: {
    flex: 0.5,
    flexDirection: 'row',
  },
  responseButtonGreen: {
    backgroundColor: 'green',
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
  },
  responseButtonRed: {
    backgroundColor: '#990000',
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
  },
  responseButtonYellow: {
    backgroundColor: '#f46a00',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseButtonGrey: {
    backgroundColor: '#808080',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  detail: {
    textAlign: 'center',
    padding: 10,
  },
  buttonContainerOutter: {
    flex: 0.3,
  },
  touchable: {
    width: '50%',
  },
  touchablefull: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    flexWrap: 'wrap',
  },
});

export default styles;
