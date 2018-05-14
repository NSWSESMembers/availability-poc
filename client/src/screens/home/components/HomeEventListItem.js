import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EventListItem from '../../../components/Events/EventListItem';

class HomeEventListItem extends PureComponent {
  handlePress = () => {
    const { onPress, event } = this.props;
    onPress(event);
  }

  render() {
    const { urgent } = this.props;
    return (
      <EventListItem event={this.props.event} onPress={this.handlePress} urgent={urgent} />
    );
  }
}
HomeEventListItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  urgent: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

export default HomeEventListItem;
