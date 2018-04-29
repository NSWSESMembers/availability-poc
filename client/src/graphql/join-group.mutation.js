import gql from 'graphql-tag';

export default gql`
  mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
    addUserToGroup(groupUpdate: $groupUpdate) {
      id
      name
      tags {
        id
        name
        type
      }
      users {
        id
        username
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
