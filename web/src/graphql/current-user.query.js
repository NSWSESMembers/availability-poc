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
        tags {
          name
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
