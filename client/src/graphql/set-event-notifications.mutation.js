import gql from 'graphql-tag';

export default gql`
  mutation setEventNotifications($notifications: SetEventNotificationsInput!) {
    setEventNotifications(notifications: $notifications)
  }
`;
