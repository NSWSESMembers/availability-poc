import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

export default gql`
  mutation createMessage($message: CreateMessageInput!) {
    createMessage(message: $message) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;
