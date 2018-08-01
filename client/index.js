import {
  AppRegistry,
  YellowBox,
} from 'react-native';
import codePush from 'react-native-code-push';
import App from './src/app';

const codePushOptions = {
  checkFrequency: (
    (!__DEV__) ? codePush.CheckFrequency.ON_APP_RESUME
      : codePush.CheckFrequency.MANUAL),
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE,
};

// suppress false-positive isMounted() deprecation warning
// proper fix coming from react-native soon:
// https://github.com/facebook/react-native/issues/18868#issuecomment-387627007
if (YellowBox) {
  YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
}

AppRegistry.registerComponent(
  'Callout',
  () => codePush(codePushOptions)(App),
);
