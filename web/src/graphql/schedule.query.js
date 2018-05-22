import gql from 'graphql-tag';

const SCHEDULE_QUERY = gql`
  query schedule($id: Int!) {
    schedule(id: $id) {
      id
      name
      details
      group {
        id
        name
        users {
          id
          username
          displayName
        }
      }
      timeSegments {
        id
        status
        startTime
        endTime
        user {
          id
        }
      }
    }
  }
`;

export default SCHEDULE_QUERY;
