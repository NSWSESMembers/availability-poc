import gql from 'graphql-tag';

export default gql`
  mutation removeUserFromGroup($groupUpdate: RemoveUserFromGroupInput!) {
    removeUserFromGroup(groupUpdate: $groupUpdate) {
      id
      name
      tags {
         name
         id
       }
       users {
         username
         id
       }
       events {
         id
         name
         details
       }
       schedules {
         id
         name
         details
         startTime
         endTime
       }
    }
  }
`;
