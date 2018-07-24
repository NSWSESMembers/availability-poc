import gql from 'graphql-tag';

import EVENT_FRAGMENT from './event.fragment';
import TAG_FRAGMENT from './tag.fragment';
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
      tags {
        ...TagFragment
      }
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
  ${TAG_FRAGMENT}
  ${EVENT_FRAGMENT}
  ${SCHEDULE_FRAGMENT}
  ${GROUP_FRAGMENT}
`;
