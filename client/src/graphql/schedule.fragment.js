import gql from 'graphql-tag';

const SCHEDULE_FRAGMENT = gql`
  fragment ScheduleFragment on Schedule {
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
`;

export default SCHEDULE_FRAGMENT;
