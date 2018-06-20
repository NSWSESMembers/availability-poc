import gql from 'graphql-tag';

import TAG_FRAGMENT from './tag.fragment';
import EVENT_FRAGMENT from './event.fragment';
import SCHEDULE_FRAGMENT from './schedule.fragment';

const GROUP_FRAGMENT = gql`
  fragment GroupFragment on Group {
    id
    name
    icon
    tags {
      ...TagFragment
    }
    users {
      id
      username
      displayName
    }
    events {
      ...EventFragment
    }
    schedules {
      ...ScheduleFragment
    }
  }
  ${TAG_FRAGMENT}
  ${EVENT_FRAGMENT}
  ${SCHEDULE_FRAGMENT}
`;

export default GROUP_FRAGMENT;
