import gql from 'graphql-tag';

export default gql`
  mutation createSchedule($schedule: CreateScheduleInput!) {
    createSchedule(schedule: $schedule) {
      id
      name
      details
      startTime
      endTime
    }
  }
`;
