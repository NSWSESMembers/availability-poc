import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  Button,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import SET_EVENT_RESPONSE_MUTATION from '../graphql/set-event-response.mutation';
import EVENT_QUERY from '../graphql/event.query';

import { extendAppStyleSheet } from './style-sheet';

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
  },
  placeholder: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },
});

class EventResponseEdit extends Component {
  static navigationOptions = {
    title: 'Edit Response',
  }
  constructor(props) {
    super(props);
    const { eventId, eventResponse } = this.props.navigation.state.params;
    this.eventId = eventId;
    this.eventResponse = eventResponse;
  }
  state = {
    loading: false,
  }

  setRespond = () => {
    this.updateAndReturn({ status: 'responding' });
  }
  setUnavailable = () => {
    this.updateAndReturn({ status: 'unavailable' });
  }
  setTentative = () => {
    this.updateAndReturn({ status: 'tentative' });
  }
  updateAndReturn = (params) => {
    this.setState({ loading: true });
    this.props.setEventResponseQuery({
      id: this.eventId,
      ...params,
    })
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert(
          'Error updating response',
          error.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
        );
      });
  }
  render() {
    const { eventResponse } = this;
    return (
      <View style={styles.container}>
        <Text>{`Event ID: ${this.eventId}`}</Text>
        <Text>{`Status: ${eventResponse.status}`}</Text>
        <Text>{`Detail: ${eventResponse.detail}`}</Text>
        <Text>{`Destination: ${eventResponse.destination}`}</Text>
        <Button title="Responding" onPress={this.setRespond} />
        <Button title="Tentative" onPress={this.setTentative} />
        <Button title="Unavailable" onPress={this.setUnavailable} />
        { this.state.loading ? <ActivityIndicator /> : null }
      </View>
    );
  }
}

EventResponseEdit.propTypes = {
  setEventResponseQuery: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        eventId: PropTypes.number.isRequired,
        eventResponse: PropTypes.shape({
          status: PropTypes.string,
          detail: PropTypes.string,
          destination: PropTypes.string,
        }),
      }),
    }),
  }),
};

const setEventResponse = graphql(SET_EVENT_RESPONSE_MUTATION, {
  props: ({ mutate }) => ({
    setEventResponseQuery: response =>
      mutate({
        variables: { response },
        refetchQueries: [
          {
            query: EVENT_QUERY,
            variables: { eventId: response.id },
          },
        ],
      }),
  }),
});

export default compose(
  setEventResponse,
)(EventResponseEdit);
