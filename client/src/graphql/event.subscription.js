import gql from 'graphql-tag';

import EVENT_FRAGMENT from './event.fragment';

const EVENT_SUBSCRIPTION = gql`
  subscription event($eventId: Int!) {
    event(eventId: $eventId) {
      ... EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

export default EVENT_SUBSCRIPTION;
