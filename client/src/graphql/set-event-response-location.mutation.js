import gql from 'graphql-tag';

import EVENT_RESPONSE_FRAGMENT from './event-response.fragment';

export default gql`
  mutation setEventResponseLocation($location: SetEventResponseLocationInput!) {
    setEventResponseLocation(location: $location) {
      ...EventResponseFragment
    }
  }
  ${EVENT_RESPONSE_FRAGMENT}
`;
