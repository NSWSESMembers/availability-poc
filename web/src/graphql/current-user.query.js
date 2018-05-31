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
        id
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
        group {
          id
          name
        }
        eventLocations {
          id
          name
          detail
          icon
          locationLatitude
          locationLongitude
        }
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
