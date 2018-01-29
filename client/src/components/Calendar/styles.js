import { StyleSheet } from 'react-native';

const dayButton = {
  borderWidth: 0,
  borderColor: 'rgba(0,0,0,0.2)',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  backgroundColor: '#fff',
  borderRadius: 30,
};

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
  },
  empty: {
    backgroundColor: '#FFF',
    marginTop: 20,
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
    backgroundColor: '#FFF',
  },
  rowDetail: {
    flexDirection: 'row',
    marginRight: 5,
  },
  rowDetailItem: {
    margin: 5,
    padding: 5,
    backgroundColor: '#68a0cf',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rowDetailItemText: {
    color: '#fff',
  },
  rowHeader: {
    paddingLeft: 10,
    backgroundColor: '#EEE',
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DDD',
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
    backgroundColor: '#DDD',
  },
  bottomLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#DDD',
  },
  hiddenLine: {
    width: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#DDD',
  },
  content: {
    marginRight: 20,
  },
  contentText: {
    fontSize: 12,
    color: '#6B6B6B',
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
  },
  dayButton,
  dayButtonSelected: {
    ...dayButton,
    backgroundColor: '#f48603',
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
    color: '#fff',
  },
});

export default styles;
