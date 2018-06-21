import gql from 'graphql-tag';

const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    text
    edited
    image
    user {
      id
      username
      displayName
    }
    createdAt
  }
`;

export default MESSAGE_FRAGMENT;
