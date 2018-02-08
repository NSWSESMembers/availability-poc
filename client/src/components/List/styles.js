import { extendAppStyleSheet } from '../../screens/style-sheet';

const styles = extendAppStyleSheet({
  container: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  subtitleText: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12,
    color: '#6B6B6B',
  },
  titleText: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    marginRight: 8,
  },
});

export default styles;
