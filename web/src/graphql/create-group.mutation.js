import gql from 'graphql-tag';

// the results of this query must match the fields we expect to use in
// groups.screen - check prop types
export default gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
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
