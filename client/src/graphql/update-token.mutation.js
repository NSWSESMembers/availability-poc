import gql from 'graphql-tag';

export default gql`
  mutation updateToken($token: TokenUpdateInput!) {
    updateToken(token: $token)
  }
`;
