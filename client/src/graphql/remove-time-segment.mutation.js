import gql from 'graphql-tag';

export default gql`
  mutation removeTimeSegment($timeSegment: removeTimeSegmentInput!) {
    removeTimeSegment(timeSegment: $timeSegment)
  }
`;
