import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScheduleListItem from '../../../components/Schedules/ScheduleListItem';

class HomeScheduleListItem extends PureComponent {
  handlePress = () => {
    const { onPress, schedule } = this.props;
    onPress(schedule);
  }

  render() {
    return (
      <ScheduleListItem schedule={this.props.schedule} onPress={this.handlePress} />
    );
  }
}
HomeScheduleListItem.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default HomeScheduleListItem;
