import React, { Component } from 'react';
import { View } from 'react-native';
import SelectMultiple from 'react-native-select-multiple';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, compose } from 'react-apollo';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import { Container } from '../../components/Container';
import { Progress } from '../../components/Progress';

import { setSelectedRequests } from '../../state/availability.actions';

class Requests extends Component {
  static navigationOptions = () => ({
    title: 'Requests',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
  });

  onSelectionChange = (selectedRequests) => {
    this.props.dispatch(setSelectedRequests(selectedRequests));
  };

  render() {
    const { loading, user } = this.props;

    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    const selectMultiple = this.props.user.schedules.map(schedule => ({
      label: schedule.name,
      value: schedule.id.toString(),
    }));

    return (
      <View>
        <SelectMultiple
          items={selectMultiple}
          selectedItems={this.props.selectedRequests}
          onSelectionsChange={this.onSelectionChange}
        />
      </View>
    );
  }
}

Requests.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedRequests: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  loading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

const mapStateToProps = ({ auth, availability }) => ({
  auth,
  selectedRequests: availability.selectedRequests,
});

export default compose(connect(mapStateToProps), userQuery)(Requests);
