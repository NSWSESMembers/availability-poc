import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, Button, Text, View } from 'react-native';
import { graphql, compose } from 'react-apollo';

import { connect } from 'react-redux';

import { extendAppStyleSheet } from '../style-sheet';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';
import { ButtonNavBar } from '../../components/Button';
import { ListItem } from '../../components/List';
import { Container, Holder } from '../../components/Container';
import { Progress } from '../../components/Progress';

const styles = extendAppStyleSheet({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Header = ({ onPress, onPressFind }) => (
  <View style={styles.header}>
    <Button title="Create New Group" onPress={onPress} />
    <Button title="Find & Join Groups" onPress={onPressFind} />
  </View>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
  onPressFind: PropTypes.func.isRequired,
};

class Group extends Component {
  goToGroup = () => {
    this.props.goToGroup(this.props.group);
  }

  render() {
    const { name, icon } = this.props.group;
    const tags = this.props.group.tags.map(elem => `#${elem.name}`).join(',');

    return (
      <ListItem
        title={name}
        bold
        subtitle={tags !== '' ? tags : 'No Tags'}
        icon={icon}
        onPress={this.goToGroup}
      />
    );
  }
}

Group.propTypes = {
  goToGroup: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
      }),
    ),
  }),
};

class Root extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'My Groups',
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ButtonNavBar onPress={() => navigation.navigate('NewGroup')} icon="plus" />
        <ButtonNavBar onPress={() => navigation.navigate('SearchGroup')} icon="search" />
      </View>
    ),
  });

  onRefresh = () => {
    this.props.refetch();
  }

  keyExtractor = item => item.id;

  goToGroup = (group) => {
    const { navigate } = this.props.navigation;
    navigate('Group', { groupId: group.id });
  }

  goToSearchGroup = () => {
    const { navigate } = this.props.navigation;
    navigate('SearchGroup');
  }

  renderItem = ({ item }) => <Group group={item} goToGroup={this.goToGroup} />;

  render() {
    const { loading, user, networkStatus } = this.props;

    // render loading placeholder while we fetch groups
    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    if (user && !user.groups.length) {
      return (
        <Holder wide transparent>
          <Text onPress={this.onRefresh}>
            You are not a member of any groups. click to reload
          </Text>
        </Holder>
      );
    }

    // render list of groups for user
    return (
      <Holder wide transparent>
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </Holder>
    );
  }
}
Root.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.string,
        tags: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
          }),
        ),
        users: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
          }),
        ),
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), userQuery)(Root);
