import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query {
    device {
      id
      uuid
      pushToken
    }
  }
`;
