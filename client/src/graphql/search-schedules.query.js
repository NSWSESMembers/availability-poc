import gql from 'graphql-tag';

export default gql`
  query schedule($scheduleId: Int!){
    user {
      id
      username
      schedules(id: $scheduleId){
        id
        name
        details
        startTime
        endTime
        timeSegments {
          id
          status
          startTime
          endTime
          user {
            id
            username
          }
        }
      }
    }
  }
`;
