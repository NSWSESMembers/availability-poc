import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

const MESSAGE_SUBSCRIPTION = gql`
  subscription message($eventId: Int) {
    message(eventId: $eventId) {
        ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default MESSAGE_SUBSCRIPTION;
