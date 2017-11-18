import { _ } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import update from 'immutability-helper';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';
import CURRENT_USER_QUERY from '../graphql/current-user.query';
import CREATE_GROUP_MUTATION from '../graphql/create-group.mutation';

const goToNewGroup = group => NavigationActions.back();
// const goToNewGroup = group => NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'Main' }),
//   ],
// });

const styles = extendAppStyleSheet({
  detailsContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  inputBorder: {
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  inputInstructions: {
    paddingTop: 6,
    color: '#777',
    fontSize: 12,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selected: {
    flexDirection: 'row',
  },
  navIcon: {
    color: 'blue',
    fontSize: 18,
    paddingTop: 2,
  },
  participants: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
});

class FinalizeGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: (
        isReady ? <Button
          title="Create"
          onPress={state.params.create}
        /> : undefined
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };

    this.create = this.create.bind(this);
    this.pop = this.pop.bind(this);
  }

  componentDidMount() {
    this.refreshNavigation(this.state.name);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.name !== this.state.name) {
      this.refreshNavigation(nextState.name);
    }
  }

  pop() {
    this.props.navigation.goBack();
  }

  create() {
    const { createGroup } = this.props;

    createGroup({
      name: this.state.name,
    }).then((res) => {
      this.props.navigation.dispatch(goToNewGroup(res.data.createGroup));
    }).catch((error) => {
      Alert.alert(
        'Error Creating New Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }

  refreshNavigation(ready) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: ready ? 'ready' : undefined,
      create: this.create,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.imageContainer}>
            <Image
              style={styles.groupImage}
              source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
            />
            <Text>edit</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <View style={styles.inputBorder}>
              <TextInput
                autoFocus
                onChangeText={name => this.setState({ name })}
                placeholder="Group Subject"
                style={styles.input}
              />
            </View>
            <Text style={styles.inputInstructions}>
              {'Please provide a group subject and optional group icon'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

FinalizeGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
      }),
    }),
  }),
};

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createGroup: ({ name }) =>
      mutate({
        variables: { group: { name }},
        update: (store, { data: { createGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: CURRENT_USER_QUERY, variables: { id: ownProps.auth.id } });

          // Add our message from the mutation to the end.
          data.user.groups.push(createGroup);

          // Write our data back to the cache.
          store.writeQuery({
            query: CURRENT_USER_QUERY,
            variables: { id: ownProps.auth.id },
            data,
          });
        },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  createGroupMutation,
)(FinalizeGroup);
