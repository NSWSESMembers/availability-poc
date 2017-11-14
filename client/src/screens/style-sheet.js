import { StyleSheet } from 'react-native';

/**
 * Shared application styles.
 */
export const appStyles = {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 6
  },
  warning: {
    padding: 12,
    textAlign: 'center'
  },
  input: {
    color: 'black',
    height: 32
  }
};

/**
 * Combines the app style sheet and @a customStyles.
 */
export function extendAppStyleSheet(customStyles) {
  return StyleSheet.create({ ...appStyles, ...customStyles });
}
