import { StyleSheet } from 'react-native';

const day = {
  alignSelf: 'stretch',
  flex: 1,
  alignItems: 'center',
  padding: 10,
  borderWidth: 1,
  margin: 2,
};

const styles = StyleSheet.create({
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  day: {
    ...day,
  },
  dayOutOfRange: {
    ...day,
    borderColor: '#AAA',
  },
  dayAvailable: {
    ...day,
    backgroundColor: 'lightgreen',
  },
  dayUnavailable: {
    ...day,
    backgroundColor: 'red',
  },
  dayUrgent: {
    ...day,
    backgroundColor: 'orange',
  },
  daySelect: {
    ...day,
    borderColor: 'teal',
  },
  dayLabel: {},
  dayLabelOutOfRange: {
    color: '#AAA',
  },
  dayLabelAvailable: {
    fontWeight: 'bold',
  },
  dayLabelUnavailable: {
    fontWeight: 'bold',
  },
  dayLabelUrgent: {
    fontWeight: 'bold',
  },
  dayLabelSelect: {
    fontWeight: 'bold',
    color: 'teal',
  },
});

export default styles;
