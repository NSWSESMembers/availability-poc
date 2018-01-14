import gql from 'graphql-tag';

import EVENT_FRAGMENT from './event.fragment';

export default gql`
  mutation setEventResponse($response: SetEventResponseInput!) {
    setEventResponse(response: $response) {
      ... EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;
