import gql from 'graphql-tag';

export default gql`
  mutation createTimeSegment($timeSegment: createTimeSegmentInput!) {
    createTimeSegment(timeSegment: $timeSegment) {
      id
      status
      startTime
      endTime
    }
  }
`;
