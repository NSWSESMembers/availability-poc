import { StyleSheet } from 'react-native';

/**
 * Shared application styles.
 */
export const appStyles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 6,
  },
  warning: {
    padding: 12,
    textAlign: 'center',
  },
  input: {
    color: 'black',
    height: 32,
  },
  h2: {
    color: '#000',
    fontSize: 22,
  },
  h3: {
    color: '#000',
    fontSize: 18,
  },
  h4: {
    color: '#000',
    fontSize: 16,
  },
};

/**
 * Combines the app style sheet and @a customStyles.
 */
export function extendAppStyleSheet(customStyles) {
  return StyleSheet.create({ ...appStyles, ...customStyles });
}
