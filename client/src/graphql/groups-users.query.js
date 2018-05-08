import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      organisation {
        groups {
          id
          name
          users {
            id
            username
          }
          tags {
            id
            name
            type
          }
        }
      }
    }
  }
`;
