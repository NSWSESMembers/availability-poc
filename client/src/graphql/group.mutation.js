import gql from 'graphql-tag';

import GROUP_FRAGMENT from './group.fragment';

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      ...GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;


export const JOIN_GROUP_MUTATION = gql`
  mutation addUserToGroup($groupUpdate: AddUserToGroupInput!) {
    addUserToGroup(groupUpdate: $groupUpdate) {
      ...GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;

export const LEAVE_GROUP_MUTATION = gql`
  mutation removeUserFromGroup($groupUpdate: RemoveUserFromGroupInput!) {
    removeUserFromGroup(groupUpdate: $groupUpdate) {
      ...GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;
