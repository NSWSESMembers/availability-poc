import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
} from 'react-native';
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
    const { name, icon } = this.props.group;
    const tags = this.props.group.tags.map(elem => `#${elem.name}`).join(',');
    this.state = {
      memberAlready: _.some(this.props.myGroups, g => g.id === this.props.group.id),
    };
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
    icon: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }),
};

class SearchGroup extends Component {
  static navigationOptions = {
    title: 'Search for Groups',
  };

  state = {
    filterString: '',
    typingTimeout: 0,
  };

  onRefresh = () => {
    this.props.refetch();
  }

  applyFilter = () => {
    this.props.refetch({ filter: this.state.filterString });
  }

  searchOnPress = (text) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      filterString: text,
      typingTimeout: setTimeout(() => {
        this.applyFilter();
      }, 500),
    });
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
          onChangeText={text => this.searchOnPress(text)}
          onClearText={null}
          placeholder="Search"
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
SearchGroup.propTypes = {
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
          icon: PropTypes.string,
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
        icon: PropTypes.string,
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
)(SearchGroup);
