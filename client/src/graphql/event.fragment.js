import gql from 'graphql-tag';

const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    id
    name
    details
    group {
      id
    }
    responses {
      status
      detail
      destination
      eta
      locationLatitude
      locationLongitude
      user {
        id
        username
        displayName
      }
    }
  }
`;

export default EVENT_FRAGMENT;
