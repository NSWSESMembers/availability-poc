import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';

import { wsLink } from '../../app';
import { Container } from '../../components/Container';
import { Progress } from '../../components/Progress';
import EVENT_MESSAGES_QUERY from '../../graphql/event-messages.query';
import MESSAGE_SUBSCRIPTION from '../../graphql/message.subscription';

import CREATE_MESSAGE_MUTATION from '../../graphql/create-message.mutation';
import styles from './styles';

class Messages extends Component {
  static navigationOptions = {
    title: 'Event Messages',
  };

  componentDidMount() {
    // reconnect websocket if it drops, refetch all data
    if (!this.reconnected) {
      this.reconnected = wsLink.onReconnected(() => {
        this.props.refetch(); // check for any data lost during disconnect
      }, this);
    }
  }

  componentWillReceiveProps(nextProps) {
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

  onSend(messages = []) {
    this.props.createMessage({
      eventId: this.props.navigation.state.params.eventId,
      text: messages[0].text,
      image: messages[0].image,
    });
    // TODO: Opertunistic cache
  }


  isDuplicateMessage = (newMessage, existingMessages) => newMessage.id !== null &&
      existingMessages.some(message => newMessage.id === message.id)

renderSystemMessage = props => (
  <View>
    <Text style={styles.systemMessageHeader}>System Message</Text>
    <SystemMessage
      {...props}
      containerStyle={{
        flex: 1,
        alignItems: 'center',
      }}
      wrapperStyle={{
        borderRadius: 15,
        backgroundColor: 'black',
        marginRight: 10,
        marginLeft: 10,
        minHeight: 20,
        justifyContent: 'flex-end',
      }}
      textStyle={{
          color: 'white',
          textAlign: 'center',
          fontSize: 16,
          lineHeight: 20,
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
      }}
    />
  </View>
)

  // Custom message bubble with name above bubble if not a message from current username
  // and custom color on left messages
  renderBubble = (props) => {
    // if its  follow on message dont print name
    if (props.isSameUser(props.currentMessage, props.previousMessage) &&
    props.isSameDay(props.currentMessage, props.previousMessage)) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
        left: {
          backgroundColor: '#d8d8d8',
        },
      }}
        />
      );
    }
    // if its not from me print name
    // eslint-disable-next-line no-underscore-dangle
    if (props.user._id !== props.currentMessage.user._id) {
      return (
        <View>
          <Text style={styles.name}>{props.currentMessage.user.name}</Text>
          <Bubble
            {...props}
            wrapperStyle={{
        left: {
          backgroundColor: '#d8d8d8',
        },
      }}
          />
        </View>
      );
    }
    // otherwise dont print name
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
      left: {
        backgroundColor: '#d8d8d8',
      },
    }}
        />
      </View>
    );
  }


  render() {
    const { loading, event } = this.props;

    // render loading placeholder while we fetch messages
    if (loading && !event) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    // render list of messages for group
    return (
      <GiftedChat
        messages={event.messages && event.messages.map(m => ({
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.createdAt * 1000), // Date(milliseconds)
          system: !m.user,
          user: m.user ? {
            _id: m.user.id,
            name: m.user.displayName,
          } : {
            _id: '0',
          },
          image: m.image,
        }))}
        onSend={messages => this.onSend(messages)}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        user={{
          _id: this.props.auth.id,
        }}
      />
    );
  }
}

Messages.propTypes = {
  createMessage: PropTypes.func.isRequired,
  refetch: PropTypes.func,
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
        image: PropTypes.string,
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
  props: ({ data: { loading, event, refetch, subscribeToMore } }) => ({
    loading,
    event,
    refetch,
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
