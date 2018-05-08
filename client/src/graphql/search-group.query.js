import gql from 'graphql-tag';

// get the user and all user's groups
export default gql`
  query group($filter: String,$groupId: Int){
    user {
      id
      displayName
      username
      organisation {
        id
         groups(filter: $filter,id: $groupId) {
            name
            icon
            id
            tags {
              id
              name
              type
            }
            users {
             id
             username
             displayName
            }
            schedules {
              id
              name
              details
              startTime
              endTime
            }
            events {
              id
              name
              details
            }
         }
      }
    }
  }
`;
