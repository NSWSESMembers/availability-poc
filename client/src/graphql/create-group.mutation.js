import gql from 'graphql-tag';

// get the user and all user's groups
export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      id
      name
    }
  }
`;

export default CREATE_GROUP_MUTATION;
