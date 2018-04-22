import React from 'react';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';

import { Root } from '../screens/home';
import NavOptions from '../config/NavOptions';
import { Detail as EventDetail, EditResponse, EventResponses } from '../screens/events';
import { Detail as ScheduleDetail } from '../screens/schedules';

const HomeNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    SchedulesDetail: {
      screen: ScheduleDetail,
    },
    EventDetail: {
      screen: EventDetail,
    },
    EventEditResponse: {
      screen: EditResponse,
    },
    EventResponses: {
      screen: EventResponses,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: NavOptions,
  },
);

// this wrapper exists soley so we can pass the modalNavigation prop down to our child screens
const HomeNavigatorWrapper = ({ screenProps }) => (
  <HomeNavigator screenProps={screenProps} />
);
HomeNavigatorWrapper.propTypes = {
  screenProps: PropTypes.shape({}),
};

export default HomeNavigatorWrapper;
