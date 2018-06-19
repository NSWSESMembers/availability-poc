import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import { graphql, compose } from 'react-apollo';
import ReversedFlatList from 'react-native-reversed-flat-list';
import update from 'immutability-helper';
import { connect } from 'react-redux';

import Message from './components/Message';
import MessageInput from './components/MessageInput';

import styles from './styles';

import EVENT_MESSAGES_QUERY from '../../graphql/event-messages.query';
import MESSAGE_SUBSCRIPTION from '../../graphql/message.subscription';

import CREATE_MESSAGE_MUTATION from '../../graphql/create-message.mutation';


class Messages extends Component {
  static navigationOptions = {
    title: 'Event Messages',
  };

  componentWillReceiveProps(nextProps) {
    // check for new messages
    if (nextProps.event) {
      // we don't resubscribe on changed props
      // because it never happens in our app
      if (!this.subscription) {
        this.subscription = nextProps.subscribeToMore({
          document: MESSAGE_SUBSCRIPTION,
          variables: { eventId: [nextProps.navigation.state.params.eventId] },
          updateQuery: (previousResult, { subscriptionData }) => {
            const newMessage = subscriptionData.data.message;
            // if it's our own mutation
            // we might get the subscription result
            // after the mutation result.
            if (this.isDuplicateMessage(
              newMessage, previousResult.event.messages,
            )
            ) {
              return previousResult;
            }
            return update(previousResult, {
              event: {
                messages: {
                  $unshift: [newMessage],
                },
              },
            });
          },
        });
      }
    }
  }


  send = (text) => {
    this.props.createMessage({
      eventId: this.props.navigation.state.params.eventId,
      text,
    }).then(() => {
      this.flatList.scrollToBottom({ animated: true });
    });
  }

  isDuplicateMessage = (newMessage, existingMessages) => newMessage.id !== null &&
      existingMessages.some(message => newMessage.id === message.id)

  keyExtractor = item => `${item.id}`;

  renderItem = ({ item: message }) => (
    <Message
      isCurrentUser={message.user.id === this.props.auth.id} // for now until we implement auth
      message={message}
    />
  )

  render() {
    const { loading, event } = this.props;

    // render loading placeholder while we fetch messages
    if (loading && !event) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    // render list of messages for group
    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={64}
        style={styles.container}
      >
        <ReversedFlatList
          ref={(ref) => { this.flatList = ref; }}
          data={event.messages && event.messages.slice().reverse()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReached={this.onEndReached}
        />
        <MessageInput send={this.send} />
      </KeyboardAvoidingView>
    );
  }
}

Messages.propTypes = {
  createMessage: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        eventId: PropTypes.number,
      }),
    }),
  }),
  auth: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string,
        edited: PropTypes.boolean,
        createdAt: PropTypes.number,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      }),
    ),
  }),
  loading: PropTypes.bool,
  subscribeToMore: PropTypes.func,
};


const eventQuery = graphql(EVENT_MESSAGES_QUERY, {
  options: ownProps => ({
    variables: {
      eventId: ownProps.navigation.state.params.eventId,
    },
  }),
  props: ({ data: { loading, event, subscribeToMore } }) => ({
    loading,
    event,
    subscribeToMore,
  }),
});

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ eventId, text }) =>
      mutate({
        variables: { message: { eventId, text } },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: EVENT_MESSAGES_QUERY,
            variables: {
              eventId,
            },
          });
          // Add our message from the mutation to the end.
          data.event.messages.unshift(createMessage);

          // Write our data back to the cache.
          store.writeQuery({
            query: EVENT_MESSAGES_QUERY,
            variables: {
              eventId,
            },
            data,
          });
        },
      }),

  }),
});


const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), eventQuery, createMessageMutation)(Messages);
