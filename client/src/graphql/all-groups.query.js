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
            name
            id
            tags {
              name
              id
           }
         }
      }
      groups {
        id
        name
      }
    }
  }
`;
