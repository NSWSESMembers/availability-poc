import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const day = {
  alignSelf: 'stretch',
  flex: 1,
  alignItems: 'center',
  padding: 5,
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
    borderColor: Colors.bgOutOfRange,
  },
  dayAvailable: {
    ...day,
    backgroundColor: Colors.bgBtnAvailable,
  },
  dayUnavailable: {
    ...day,
    backgroundColor: Colors.bgBtnUnavailable,
  },
  dayUrgent: {
    ...day,
    backgroundColor: Colors.bgBtnUrgent,
  },
  daySelect: {
    ...day,
    borderColor: Colors.bdMain,
  },
  dayEdit: {
    ...day,
    backgroundColor: Colors.bgMain,
    borderColor: Colors.bgMain,
  },
  dayLabel: {},
  dayLabelOutOfRange: {
    textDecorationLine: 'line-through',
    color: Colors.bgOutOfRange,
  },
  dayLabelAvailable: {
    fontWeight: 'bold',
    color: Colors.bgWhite,
  },
  dayLabelUnavailable: {
    fontWeight: 'bold',
    color: Colors.bgWhite,
  },
  dayLabelUrgent: {
    fontWeight: 'bold',
    color: Colors.bgWhite,
  },
  dayLabelSelect: {
    fontWeight: 'bold',
    color: Colors.bdMain,
  },
  dayLabelEdit: {
    fontWeight: 'bold',
    color: Colors.bgWhite,
  },
  dayIcon: {
    color: Colors.bgWhite,
  },
  dayIconSelect: {
    color: Colors.bdMain,
  },
  timeSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});

export default styles;
