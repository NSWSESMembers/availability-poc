import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      username
      organisation {
        id
        name
        groups {
          id
          name
          icon
        }
      }
      groups {
        id
        name
        icon
      }
    }
  }
`;
