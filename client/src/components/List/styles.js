import { StyleSheet } from 'react-native';

import { extendAppStyleSheet } from '../../screens/style-sheet';

const styles = extendAppStyleSheet({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 6
  },
  indicator: {
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    marginLeft: 6,
    marginRight: 12,
    width: 20
  },
  available: {
    backgroundColor: '#77D353',
    borderColor: '#44A020'
  },
  unavailable: {
    backgroundColor: '#F95F62',
    borderColor: '#930000'
  },
  separator: {
    backgroundColor: '#E2E2E2',
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  eventCard: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderWidth: 1,
    margin: 10,
    marginBottom: 0,
    padding: 10,
  },
  eventHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventAgo: {
    color: '#333',
    fontSize: 10,
  },
  eventUrgent: {
    borderColor: 'red',
  },
});

export default styles;
