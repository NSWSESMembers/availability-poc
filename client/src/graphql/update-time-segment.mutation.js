import gql from 'graphql-tag';

export default gql`
  mutation updateTimeSegment($timeSegment: updateTimeSegmentInput!) {
    updateTimeSegment(timeSegment: $timeSegment) {
      id
      status
      startTime
      endTime
    }
  }
`;
