import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query tag($nameFilter: String,$typeFilter: String){
    user {
      id
      organisation {
        id
        tags(nameFilter: $nameFilter,typeFilter: $typeFilter) {
          id
          name
          type
        }
        users {
          id
          username
          email
          displayName
        }
      }
    }
  }
`;
