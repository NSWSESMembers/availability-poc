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
            icon
            id
            tags {
              id
              name
              type
            }
            users {
             id
             username
            }
            schedules {
              id
              name
              details
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
