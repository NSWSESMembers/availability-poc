import gql from 'graphql-tag';

import EVENT_RESPONSE_FRAGMENT from './event-response.fragment';

const EVENT_RESPONSE_SUBSCRIPTION = gql`
  subscription eventResponse($eventId: Int!) {
    eventResponse(eventId: $eventId) {
      ... EventResponseFragment
    }
  }
  ${EVENT_RESPONSE_FRAGMENT}
`;

export default EVENT_RESPONSE_SUBSCRIPTION;
