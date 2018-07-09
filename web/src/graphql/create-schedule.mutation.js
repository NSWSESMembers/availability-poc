import gql from 'graphql-tag';

export default gql`
  mutation createSchedule($schedule: CreateScheduleInput!) {
    createSchedule(schedule: $schedule) {
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
