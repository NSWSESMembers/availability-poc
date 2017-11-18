import gql from 'graphql-tag';

export default gql`
  mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
    addUserToGroup(groupUpdate: $groupUpdate) {
      id
    }
  }
`;
