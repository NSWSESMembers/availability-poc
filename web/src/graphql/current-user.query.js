import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      displayName
      email
      username
      organisation {
        groups {
          id
          name
          createdAt
          updatedAt
          tags {
            id
            name
            type
          }
        }
      }
      groups {
        id
        name
        createdAt
        updatedAt
        tags {
          id
          name
          type
        }
      }
      events {
        id
        name
        details
      }
      schedules {
        group {
          id
          name
        }
        id
        name
        details
        startTime
        endTime
      }
    }
  }
`;
