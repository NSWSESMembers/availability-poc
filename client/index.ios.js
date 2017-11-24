import {
  AppRegistry,
} from 'react-native';
import codePush from 'react-native-code-push';
import App from './src/app';

if (!__DEV__) {
  const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    updateDialog: true,
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
  };
}

AppRegistry.registerComponent(
  'availpoc',
  () => codePush(codePushOptions)(App)
);
