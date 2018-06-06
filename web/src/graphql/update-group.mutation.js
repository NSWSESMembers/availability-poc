import gql from 'graphql-tag';

export default gql`
  mutation updateGroup($group: UpdateGroupInput!) {
    updateGroup(group: $group) {
      id
      name
      icon
      tags {
        id
        name
        type
      }
      users {
        id
        username
      }
    }
  }
`;
