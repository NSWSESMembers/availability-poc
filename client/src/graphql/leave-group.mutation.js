import gql from 'graphql-tag';

export default gql`
  mutation removeUserFromGroup($groupUpdate: RemoveUserFromGroupInput!) {
    removeUserFromGroup(groupUpdate: $groupUpdate)
  }
`;
