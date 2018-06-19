import gql from 'graphql-tag';

import TAG_FRAGMENT from './tag.fragment';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      organisation {
        groups {
          id
          name
          users {
            id
            username
          }
          tags {
            ...TagFragment
          }
        }
      }
    }
  }
  ${TAG_FRAGMENT}
`;
