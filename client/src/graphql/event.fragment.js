import gql from 'graphql-tag';

import EVENT_RESPONSE_FRAGMENT from './event-response.fragment';

const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    id
    name
    details
    sourceIdentifier
    permalink
    group {
      id
    }
    eventLocations {
      id
      name
      detail
      icon
      locationLatitude
      locationLongitude
    }
    responses {
      ... EventResponseFragment
    }
  }
  ${EVENT_RESPONSE_FRAGMENT}
`;

export default EVENT_FRAGMENT;
