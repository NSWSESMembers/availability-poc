import gql from 'graphql-tag';

export default gql`
  mutation login($user: LoginInput!) {
    login(user: $user) {
      id
      username
      authToken
    }
  }
`;
