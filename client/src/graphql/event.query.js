import gql from 'graphql-tag';

import EVENT_FRAGMENT from './event.fragment';

const EVENT_QUERY = gql`
  query event($eventId: Int!) {
    event(id: $eventId) {
      ... EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

export default EVENT_QUERY;
