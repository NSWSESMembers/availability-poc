import { StyleSheet } from 'react-native';
import Colors from '../../themes/Colors';

const dayButton = {
  borderWidth: 0,
  borderColor: 'rgba(0,0,0,0.2)',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  backgroundColor: Colors.bgWhite,
  borderRadius: 30,
};

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
  },
  empty: {
    backgroundColor: Colors.bgWhite,
    marginTop: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: Colors.bgWhite,
  },
  rowDetail: {
    flexDirection: 'row',
    marginRight: 5,
  },
  rowDetailItem: {
    margin: 5,
    padding: 5,
    backgroundColor: Colors.bgBtnAvailable,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.bdWhite,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rowDetailItemText: {
    color: Colors.txtWhite,
  },
  rowHeader: {
    paddingLeft: 10,
    backgroundColor: Colors.bgLight,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.bdLight,
  },
  rowHeaderText: {
    fontSize: 11,
  },
  timeline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 120,
    justifyContent: 'center', // center the dot
    alignItems: 'center',
  },
  timelineRow: {
    padding: 4,
    paddingLeft: 0,
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 59,
    width: 2,
    bottom: 0,
  },
  topLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.bgLight,
  },
  bottomLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.bgLight,
  },
  hiddenLine: {
    width: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.bgLight,
  },
  content: {
    marginRight: 20,
  },
  contentText: {
    fontSize: 12,
    color: Colors.txtDark,
    textAlign: 'right',
  },
  week: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dayLabel: {
    marginBottom: 2,
    fontSize: 12,
  },
  dayButton,
  dayButtonSelected: {
    ...dayButton,
    backgroundColor: Colors.bgBtn,
  },
  dayText: {
    marginTop: 2,
  },
  dayTextSelected: {
    color: 'white',
  },
  dayHasDetail: {
    alignItems: 'center',
    lineHeight: 2,
  },
  dayHasDetailSelected: {
    alignItems: 'center',
    lineHeight: 2,
    color: Colors.txtWhite,
  },
});

export default styles;
