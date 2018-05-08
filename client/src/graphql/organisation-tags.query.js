import gql from 'graphql-tag';

// get the orgs tags
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
      }
    }
  }
`;
