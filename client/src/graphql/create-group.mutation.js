import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      id
      name
      tags
      {
        name
        id
      }
    }
  }
`;
