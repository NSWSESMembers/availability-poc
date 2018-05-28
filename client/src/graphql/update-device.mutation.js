import gql from 'graphql-tag';

export default gql`
  mutation updateDevice($device: DeviceUpdateInput!) {
    updateDevice(device: $device) {
      id
      uuid
      pushToken
    }
  }
`;
