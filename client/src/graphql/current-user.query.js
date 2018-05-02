import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      displayName
      email
      username
      groups {
        id
        name
        icon
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
        id
        name
        details
        startTime
        endTime
        timeSegments {
          user {
            id
          }
          id
          status
          startTime
          endTime
        }
      }
    }
  }
`;
