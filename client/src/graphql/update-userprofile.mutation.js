import gql from 'graphql-tag';

export default gql`
  mutation updateUserProfile($user: updateUserProfileInput!) {
    updateUserProfile(user: $user) {
      id
      username
      displayName
    }
  }
`;
