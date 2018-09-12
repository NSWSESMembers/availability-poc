import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { Progress } from '../../components/Progress';
import { TagModal } from '../../components/Modal';
import IconModal from './IconModal';
import groupIcons from '../../fixtures/icons';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import { CREATE_GROUP_MUTATION } from '../../graphql/group.mutation';
import ORGANISATION_TAGS from '../../graphql/organisation-tags.query';
import Icon from '../../components/Icon';
import styles from './styles';

const goToNewGroup = () => NavigationActions.back();

class NewGroup extends Component {
  static navigationOptions = () => ({
    title: 'New Group',
  });

  state = {
    name: '',
    icon: 'fa-group',
    tags: [],
    iconModal: false,
    tagsModal: false,
    filterString: '',
    typingTimeout: 0,
    loading: false,
  }

  pop = () => {
    this.props.navigation.goBack();
  }

  pickIcon = () => {
    this.setState({
      iconModal: true,
    });
  }

  pickTags = () => {
    this.setState({
      tagsModal: true,
    });
  }

  handleIconBack = () => {
    this.setState({
      iconModal: false,
    });
  }

  handleIconChange = (answer) => {
    this.setState({
      iconModal: false,
      icon: answer.icon,
    });
  }

handleTagBack = () => {
  this.setState({
    tagsModal: false,
  });
}

searchTagOnPress = (text) => {
  if (this.state.typingTimeout) {
    clearTimeout(this.state.typingTimeout);
  }

  this.setState({
    filterString: text,
    typingTimeout: setTimeout(() => {
      this.applyTagSearchFilter();
    }, 500),
  });
}

handleTagChange = (option) => {
  const tmpSelectedTags = [...this.state.tags];
  const index = tmpSelectedTags.indexOf(option.id);
  if (index !== -1) {
    tmpSelectedTags.splice(index, 1);
  } else {
    tmpSelectedTags.push(option.id);
  }
  this.setState({ tags: tmpSelectedTags });
}

applyTagSearchFilter = () => {
  this.props.refetch({ nameFilter: this.state.filterString });
}

  create = () => {
    const { createGroup } = this.props;
    this.setState({
      loading: true,
    },
    () => createGroup({
      name: this.state.name,
      icon: this.state.icon,
      tags: this.state.tags.map(tag => ({ id: tag })),
    }).then((res) => {
      this.props.navigation.dispatch(goToNewGroup(res.data.createGroup));
    }).catch((error) => {
      Alert.alert(
        'Error Creating New Group',
        error.message,
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                loading: false,
              });
            },
          },
        ],
      );
    }));
  }

  render() {
    const { user, loading } = this.props;

    if (!user || this.state.loading) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    return (
      <Container>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.imageContainer} onPress={this.pickIcon}>
            <View style={styles.itemContainer}>
              <Icon size={30} name={this.state.icon} />
            </View>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <View style={styles.inputBorder}>
              <TextInput
                autoFocus
                onChangeText={name => this.setState({ name })}
                placeholder="Group Name"
                style={styles.input}
              />
            </View>
            <Text style={styles.inputInstructions}>
              {'Please provide a group name and optional group icon'}
            </Text>
          </View>
        </View>
        <Button
          style={styles.saveButton}
          text="Group Tags"
          onPress={this.pickTags}
        />
        <Text />
        <Text />
        <Button
          disabled={this.state.name === ''}
          text="Create Group"
          onPress={this.create}
        />
        <IconModal
          title="Select Your Group Icon"
          visible={this.state.iconModal}
          closeModal={this.handleIconBack}
          backModal={this.handleIconBack}
          onChange={this.handleIconChange}
          Selected={this.state.icon}
          data={groupIcons}
        />
        <TagModal
          visible={this.state.tagsModal}
          closeModal={this.handleTagBack}
          onSearch={this.searchTagOnPress}
          onSelect={this.handleTagChange}
          isLoading={loading}
          headerText="Select Group Tags"
          backModal={this.handleTagBack}
          dataIn={user && user.organisation.tags}
          selectedTags={this.state.tags}
        />
      </Container>
    );
  }
}

NewGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
        }),
      ),
    }),
  }),
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
      }),
    }),
  }),
};

const tagsQuery = graphql(ORGANISATION_TAGS, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: 'orgStructure',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    createGroup: ({ name, tags, icon }) =>
      mutate({
        variables: { group: { name, tags, icon } },
        update: (store, { data: { createGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: CURRENT_USER_QUERY,
          });

          // Add our group from the mutation to the end.
          data.user.groups.push(createGroup);

          // Write our data back to the cache.
          store.writeQuery({
            query: CURRENT_USER_QUERY,
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
  tagsQuery,
  createGroupMutation,
)(NewGroup);
