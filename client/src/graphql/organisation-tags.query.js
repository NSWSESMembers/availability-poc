import gql from 'graphql-tag';

import TAG_FRAGMENT from './tag.fragment';

// get the orgs tags
export default gql`
  query tag($nameFilter: String,$typeFilter: String){
    user {
      id
      organisation {
        id
        tags(nameFilter: $nameFilter,typeFilter: $typeFilter) {
          ...TagFragment
        }
      }
    }
  }
  ${TAG_FRAGMENT}
`;
