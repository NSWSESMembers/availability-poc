import gql from 'graphql-tag';

// get the orgs tags
export default gql`
  query tag {
    orgUser: user {
      id
      organisation {
        id
        tags {
          id
          name
          type
        }
        groups {
          id
          name
          createdAt
          updatedAt
          tags {
            id
            name
            type
          }
          users {
            id
            username
            displayName
            email
          }
        }
        users {
          id
          username
          displayName
          email
        }
      }
      groups {
        id
        name
        createdAt
        updatedAt
        tags {
          id
          name
          type
        }
      }
    }
  }
`;
