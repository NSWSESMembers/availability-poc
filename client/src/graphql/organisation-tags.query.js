import gql from 'graphql-tag';

// get the orgs tags
export default gql`
  query tag($filter: String){
    user {
      id
      organisation {
        id
        tags(filter: $filter) {
            id
            name
        }
      }
    }
  }
`;
