import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';

const styles = extendAppStyleSheet({
  respondContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  respondName: {
    fontWeight: 'bold',
    flex: 1,
  },
  respondTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  respondStatus: {
    flex: 1,
    color: '#8c8c8c',
    fontSize: 11,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerDetail: {
  },
  map: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    flexDirection: 'row',
    height: 300,
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },
});

const EventHeader = (props) => {
  const { name, details } = props.event;

  return (
    <View>
      <View style={styles.headerContainer}>
        <Icon name="bullhorn" size={48} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
          <Text style={styles.headerDetail} numberOfLines={3}>{details}</Text>
        </View>
      </View>
      <View style={styles.map}>
        <Text style={styles.placeholder}>MAP</Text>
      </View>
    </View>
  );
};
EventHeader.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    detail: PropTypes.string,
  }),
};

const EventResponse = (props) => {
  const { user, status, detail } = props.response;
  const color = {
    responding: 'green',
    unavailable: 'red',
  }[status.toLowerCase()];
  return (
    <View style={styles.respondContainer}>
      <Icon name="user" size={24} color={color} />
      <View style={styles.respondTextContainer}>
        <Text style={styles.respondName} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.respondStatus} numberOfLines={1}>{status} - {detail}</Text>
      </View>
    </View>
  );
};
EventResponse.propTypes = {
  response: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.required,
    }),
    status: PropTypes.string.required,
    detail: PropTypes.string,
  }),
};

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    // NYI
    this.props.refetch();
  }

  keyExtractor = (item) => {
    if (item.length === 1) {
      return item[0];
    }
    return [item[0], item[1].id];
  }

  renderItem = ({ item }) => {
    if (item[0] === 'info') {
      return <EventHeader event={item[1]} />;
    }

    return (
      <EventResponse
        response={item[1]}
      />
    );
  };

  render() {
    const { event } = this.props.navigation.state.params;

    const { loading, user, networkStatus } = this.props;
    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!event) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>
            Unable to load event.
          </Text>
        </View>
      );
    }

    const rows = [
      ['info', event],
    ].concat(_.map(event.responses, r => ['response', r]));

    // render list of groups for user
    return (
      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          extraData={event} // redraw if this changes
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}
EventDetail.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        event: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          details: PropTypes.string,
        }),
      }),
    }),
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          tags: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
            }),
          ),
        }),
      ),
    }),
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ auth }) => ({ variables: { id: auth.id } }),
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
)(EventDetail);
