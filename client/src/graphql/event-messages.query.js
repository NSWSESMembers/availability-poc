import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';


const EVENT_MESSAGES_QUERY = gql`
  query event($eventId: Int!) {
    event(id: $eventId) {
      id
      messages {
        ...MessageFragment
     }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default EVENT_MESSAGES_QUERY;
