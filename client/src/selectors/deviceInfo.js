import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const all = [
  'ApplicationName',
  'Brand',
  'BuildNumber',
  'BundleId',
  'Carrier',
  'DeviceCountry',
  'DeviceId',
  'DeviceLocale',
  'DeviceName',
  'FontScale',
  'FreeDiskStorage',
  'ReadableVersion',
  'SystemName',
  'SystemVersion',
  'Manufacturer',
  'Timezone',
  'TotalDiskCapacity',
  'TotalMemory',
  'UniqueID',
  'UserAgent',
  'Version',
];

const android = [
  'InstallReferrer',
  'InstanceID',
  'LastUpdateTime',
  'MaxMemory',
  'Model',
];

const gatherDeviceInfo = async () => {
  // WARNING: do not modify `all` - make sure you work on a copy
  let statsToGather = all;

  if (Platform.OS === 'android') {
    // this returns a new array
    statsToGather = all.concat(android);
  }

  const info = {};

  statsToGather.forEach((key) => {
    info[key] = DeviceInfo[`get${key}`]();
  });

  return info;
};

// eslint-disable-next-line import/prefer-default-export
export { gatherDeviceInfo };
