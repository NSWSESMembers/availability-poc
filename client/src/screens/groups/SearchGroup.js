import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import { SearchBar } from 'react-native-elements';
import { Container, Holder } from '../../components/Container';
import { ListItem } from '../../components/List';
import { Progress } from '../../components/Progress';

import SEARCH_GROUP_QUERY from '../../graphql/search-group.query';

class Group extends Component {
  constructor(props) {
    super(props);
    this.myGroups = this.props.myGroups;
    this.navigation = this.props.navigation;
  }

  goToGroup = () => {
    const { navigate } = this.navigation;
    navigate('Group', { groupId: this.props.group.id });
  }

  render() {
    const { name } = this.props.group;
    const tags = this.props.group.tags.map(elem => `#${elem.name}`).join(',');
    this.state = {
      memberAlready: _.some(this.props.myGroups, g => g.id === this.props.group.id),
    };
    return (
      <ListItem
        title={name}
        bold
        subtitle={tags !== '' ? tags : 'No Tags'}
        icon="group"
        onPress={this.goToGroup}
      />
    );
  }
}

Group.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  myGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }),
};

class SearchGroups extends Component {
  static navigationOptions = {
    title: 'Search for Groups',
    tabBarLabel: 'Groups',
    tabBarIcon: ({ tintColor }) => (
      <Icon size={24} name="group" color={tintColor} />
    ),
  };

  onRefresh = () => {
    this.props.refetch();
  }

  applyFilter = (text) => {
    this.props.refetch({ filter: text });
  }

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <Group
      group={item}
      myGroups={this.props.user.groups}
      navigation={this.props.navigation}
    />
  );

  render() {
    const { loading, user, networkStatus } = this.props;

    // render list of groups for user
    return (
      <Holder wide transparent>
        <SearchBar
          lightTheme
          onChangeText={text => this.applyFilter(text)}
          onClearText={null}
          placeholder="Search Here...but dont expect anything to happen"
        />
        {(loading || !user) ? (
          <Container>
            <Progress />
          </Container>
      ) : (
        <FlatList
          data={user.organisation.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          extraData={user} // redraw if this changes
          refreshing={networkStatus === 4}
        />
      )
    }
      </Holder>
    );
  }
}
SearchGroups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
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

const groupsQuery = graphql(SEARCH_GROUP_QUERY, {
  options: () => ({
    variables: {
      filter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupsQuery,
)(SearchGroups);
