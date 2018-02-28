import {
  AppRegistry,
} from 'react-native';
import codePush from 'react-native-code-push';
import App from './src/app';

const codePushOptions = {
  checkFrequency: (
    (!__DEV__) ? codePush.CheckFrequency.ON_APP_RESUME
      : codePush.CheckFrequency.MANUAL),
  updateDialog: true,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

AppRegistry.registerComponent(
  'Callout',
  () => codePush(codePushOptions)(App),
);
