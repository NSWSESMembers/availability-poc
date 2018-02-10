import gql from 'graphql-tag';

import EVENT_RESPONSE_FRAGMENT from './event-response.fragment';

export default gql`
  mutation setEventResponse($response: SetEventResponseInput!) {
    setEventResponse(response: $response) {
      ... EventResponseFragment
    }
  }
  ${EVENT_RESPONSE_FRAGMENT}
`;
