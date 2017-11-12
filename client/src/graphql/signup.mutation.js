import gql from 'graphql-tag';

export default gql`
  mutation signup($user: SignupInput!) {
    signup(user: $user) {
      id
      email
      username
      authToken
    }
  }
`;
