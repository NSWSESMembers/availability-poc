import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Image } from 'react-native';
import Prompt from 'react-native-prompt';

import gravatar from '../../../selectors/gravatar';
import { Container } from '../../../components/Container';

const styles = {
  username: {
    borderColor: '#777',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 14,
  },
  usernameHeader: {
    backgroundColor: '#dbdbdb',
    color: '#000000',
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 16,
  },
  email: {
    borderColor: '#777',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 14,
  },
  emailHeader: {
    backgroundColor: '#dbdbdb',
    color: '#000000',
    paddingHorizontal: 8,
    paddingBottom: 2,
    paddingTop: 5,
    fontSize: 16,
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputBorder: {
    flexDirection: 'row',
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
    backgroundColor: '#ed3434',
  },
  inputInstructions: {
    color: '#777',
    fontSize: 26,
    flex: 1,
  },
  userContainer: {
    paddingLeft: 16,
    backgroundColor: '#c6c0c0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gravatar: {
    paddingHorizontal: 10,
  },
  userInner: {
    flexDirection: 'row',
    backgroundColor: '#dbdbdb',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 0,
  },
};

class Profile extends Component {
  state = {
    promptVisible: false,
  }

  updateDisplayName = (value) => {
    this.setState({ promptVisible: false });
    this.props.onChangeName(value);
  }

  openPrompt = () => {
    this.setState({ promptVisible: true });
  };

  closePrompt = () => {
    this.setState({ promptVisible: false });
  };

  render() {
    const { loading, user } = this.props;

    // render loading placeholder while we fetch data
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Container>
        <Prompt
          title="Change Display Name"
          placeholder={user.displayName}
          defaultValue={user.displayName}
          visible={this.state.promptVisible}
          onCancel={this.closePrompt}
          onSubmit={this.updateDisplayName}
        />
        <View style={styles.userContainer}>
          <View style={styles.userInner}>
            <View style={styles.gravatar}>
              <Image
                style={{ borderRadius: 5, width: 50, height: 50, paddingHorizontal: 10 }}
                source={{ uri: gravatar.avatarForEmail(user.email) }}
              />
            </View>
            <Text
              onPress={this.openPrompt}
              style={styles.inputInstructions}
            >{user.displayName}
            </Text>
          </View>
        </View>
        <Text style={styles.usernameHeader}>User Name</Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.emailHeader}>Email Address</Text>
        <Text style={styles.email}>{user.email}</Text>
      </Container>
    );
  }
}

Profile.propTypes = {
  loading: PropTypes.bool,
  onChangeName: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
    displayName: PropTypes.string.isRequired,
  }),
};

export default Profile;
