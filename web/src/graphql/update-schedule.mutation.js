import gql from 'graphql-tag';

export default gql`
  mutation updateSchedule($schedule: UpdateScheduleInput!) {
    updateSchedule(schedule: $schedule) {
      group {
        id
        name
      }
      tags {
        id
        name
        type
      }
      id
      name
      type
      details
      priority
      startTime
      endTime
    }
  }
`;
