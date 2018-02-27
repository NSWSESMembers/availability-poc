import gql from 'graphql-tag';

const SCHEDULE_QUERY = gql`
  query schedule($id: Int!) {
    schedule(id: $id) {
      id
      name
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
