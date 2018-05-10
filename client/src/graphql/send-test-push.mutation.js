import gql from 'graphql-tag';

export default gql`
  mutation sendTestPush($vars: sendTestPushInput) {
    sendTestPush(vars: $vars)
  }
`;
