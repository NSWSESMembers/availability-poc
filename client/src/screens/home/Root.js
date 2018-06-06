import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import HomeList from './components/HomeList';


class HomeScreen extends Component {
  static navigationOptions = () => ({
    title: 'Home',
  });

  onRefresh = () => {
    this.props.refetch();
  };

  render() {
    const { loading, user, navigation, screenProps } = this.props;
    return (
      <HomeList
        loading={loading}
        onRefresh={this.onRefresh}
        refreshing={this.props.networkStatus === 4}
        modalNavigation={screenProps.modalNavigation}
        homeNavigation={navigation}
        user={user}
      />
    );
  }
}

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

HomeScreen.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  screenProps: PropTypes.shape({
    modalNavigation: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  }),
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(HomeScreen);
