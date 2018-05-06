import gql from 'graphql-tag';

const EVENT_RESPONSE_FRAGMENT = gql`
  fragment EventResponseFragment on EventResponse {
    status
    detail
    destination {
      id
      name
    }
    eta
    locationLatitude
    locationLongitude
    locationTime
    user {
      id
      username
      displayName
    }
  }
`;

export default EVENT_RESPONSE_FRAGMENT;
