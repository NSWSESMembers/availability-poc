import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import { FlatList, Text, Alert } from 'react-native';

import EVENT_QUERY from '../../graphql/event.query';

import { Center, Container, Holder } from '../../components/Container';
import { ListItem } from '../../components/List';
import { Progress } from '../../components/Progress';
import { Segment } from '../../components/Segment';

const ResponseList = ({ responses, networkStatus, description }) => (
  <Container>
    <FlatList
      data={responses}
      ListHeaderComponent={() =>
        (!responses.length ? (
          <Center>
            <Text>{`There are no ${description} responses yet.`}</Text>
          </Center>
        ) : null)}
      keyExtractor={response => response.user.id}
      renderItem={response => (
        <ListItem
          title={response.item.user.displayName}
          subtitle={response.item.statusText}
          icon="user"
          onPress={() => Alert.alert('PLACEHOLDER', 'User Contact Details Page')}
        />
      )}
      refreshing={networkStatus === 4}
    />
  </Container>
);
ResponseList.propTypes = {
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
      }),
      status: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
    }),
  ).isRequired,
  networkStatus: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

class EventResponses extends Component {
  static navigationOptions = {
    title: 'Event Responses',
  };

  state = {
    selectedIndex: 0,
  };

  onRefresh = () => {
    // NYI
    this.props.refetch();
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  render() {
    const { loading, event, networkStatus } = this.props;

    if (loading || !event) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    const attendingUsers = [];
    const tentativeUsers = [];
    const unavailableUsers = [];

    if (!loading || event) {
      event.responses.forEach((r) => {
        const tempResponse = Object.assign({}, r); // clone r to tempResponse
        if (!tempResponse.detail) delete tempResponse.detail;
        switch (tempResponse.status) {
          case 'attending':
            tempResponse.etaText = tempResponse.eta === 0 ? '' : `- ETA ${moment.unix(tempResponse.eta).fromNow()}`;
            tempResponse.statusText = !tempResponse.detail || tempResponse.detail === ''
              ? `${tempResponse.status} ${tempResponse.destination.name} ${tempResponse.etaText}`
              : `${tempResponse.status} ${tempResponse.destination.name} - ${tempResponse.detail} ${tempResponse.etaText}`;
            attendingUsers.push(tempResponse);
            break;
          case 'tentative':
            tempResponse.etaText = tempResponse.eta === 0 ? '' : `- ETA ${moment.unix(tempResponse.eta).fromNow()}`;
            tempResponse.statusText = tempResponse.detail === ''
              ? `${tempResponse.status} ${tempResponse.destination.name} ${tempResponse.etaText}`
              : `${tempResponse.status} ${tempResponse.destination.name} - ${tempResponse.detail} ${tempResponse.etaText}`;
            tentativeUsers.push(tempResponse);
            break;
          default: // unavailable or anything else
            unavailableUsers.push(tempResponse);
            break;
        }
      });
    }

    return (
      <Container>
        <Holder margin marginBot transparent>
          <Segment
            values={['Attending', 'Tentative', 'Unavailable']}
            handleIndexChange={this.handleIndexChange}
            selectedIndex={this.state.selectedIndex}
          />
        </Holder>
        {this.state.selectedIndex === 0 && (
          <ResponseList
            responses={attendingUsers}
            description="attending"
            networkStatus={networkStatus}
          />
        )}
        {this.state.selectedIndex === 1 && (
          <ResponseList
            responses={tentativeUsers}
            description="tentative"
            networkStatus={networkStatus}
          />
        )}
        {this.state.selectedIndex === 2 && (
          <ResponseList
            responses={unavailableUsers}
            description="unavailable"
            networkStatus={networkStatus}
          />
        )}
      </Container>
    );
  }
}

const eventQuery = graphql(EVENT_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ navigation }) => ({ variables: { eventId: navigation.state.params.eventId } }),
  props: ({ data: { loading, event, refetch } }) => ({
    loading, event, refetch,
  }),
});

EventResponses.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    eventLocations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        detail: PropTypes.string,
        icon: PropTypes.string,
        locationLatitude: PropTypes.float,
        locationLongitude: PropTypes.float,
      }),
    ),
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
        status: PropTypes.string.isRequired,
        detail: PropTypes.string,
      }),
    ),
  }),
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), eventQuery)(EventResponses);
