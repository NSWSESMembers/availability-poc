import gql from 'graphql-tag';

const SCHEDULE_QUERY = gql`
  query schedule($id: Int!) {
    schedule(id: $id) {
      id
      type
      name
      details
      startTime
      endTime
      group {
        id
        name
        users {
          id
          username
          displayName
        }
      }
      tags {
        id
        name
        type
      }
      timeSegments {
        id
        type
        status
        startTime
        endTime
        note
        tags {
          id
          name
        }
        user {
          id
        }
      }
    }
  }
`;

export default SCHEDULE_QUERY;
