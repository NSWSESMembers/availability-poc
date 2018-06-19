import gql from 'graphql-tag';

import GROUP_FRAGMENT from './group.fragment';

// get the user and all user's groups
export default gql`
  query group($filter: String,$groupId: Int){
    user {
      id
      displayName
      username
      organisation {
        id
         groups(filter: $filter,id: $groupId) {
            ...GroupFragment
         }
      }
    }
  }
  ${GROUP_FRAGMENT}
`;
