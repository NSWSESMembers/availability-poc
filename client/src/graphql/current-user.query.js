import gql from 'graphql-tag';

import EVENT_FRAGMENT from './event.fragment';
import SCHEDULE_FRAGMENT from './schedule.fragment';
import GROUP_FRAGMENT from './group.fragment';

// get the user and all user's groups
export default gql`
  query {
    user {
      id
      displayName
      email
      username
      groups {
        ...GroupFragment
      }
      events {
        ...EventFragment
      }
      schedules {
        ...ScheduleFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
  ${SCHEDULE_FRAGMENT}
  ${GROUP_FRAGMENT}
`;
