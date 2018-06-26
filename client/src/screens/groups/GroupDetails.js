import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  Alert,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Center, Container, Holder } from '../../components/Container';
import { Progress } from '../../components/Progress';
import { Segment } from '../../components/Segment';


import SEARCH_GROUP_QUERY from '../../graphql/search-group.query';
import { JOIN_GROUP_MUTATION, LEAVE_GROUP_MUTATION } from '../../graphql/group.mutation';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';

import GroupDetailsHeader from './components/GroupDetailsHeader';
import GroupDetailsList from './components/GroupDetailsList';


class GroupDetails extends Component {
  static navigationOptions = () => ({
    title: 'Group Details',
  });

  state = {
    selectedIndex: 0,
  };

  onRefresh = () => {
    this.props.refetch();
  }

  getGroup = () => this.props.user.organisation.groups[0];

  joinGroup = () => {
    this.props.joinGroupQry({ groupId: this.getGroup().id }).catch((error) => {
      Alert.alert(
        'Error Joining Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }

  leaveGroup = () => {
    this.props.leaveGroupQry({ groupId: this.getGroup().id }).then(() => {
    }).catch((error) => {
      Alert.alert(
        'Error Leaving Group',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
      );
    });
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  };

  render() {
    const { loading, user, networkStatus } = this.props;
    if (loading || !user) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    const group = this.props.user.organisation.groups[0];
    const me = this.props.user;

    // somehow we got here with no group
    if (!group) {
      return (
        <Container>
          <Center>
            <Text>Nothing here. thats weird.</Text>
          </Center>
        </Container>
      );
    }

    const memberAlready = _.some(group.users, g => g.id === me.id);
    const tags = group.tags.map(elem => `#${elem.name}`).join(', ');

    return (
      <Container>
        <GroupDetailsHeader
          groupIcon={group.icon}
          groupName={group.name}
          tags={tags}
          memberAlready={memberAlready}
          leaveGroup={this.leaveGroup}
          joinGroup={this.joinGroup}
        />
        <Holder margin transparent>
          <Segment
            values={['Users', 'Schedules', 'Events']}
            handleIndexChange={this.handleIndexChange}
            selectedIndex={this.state.selectedIndex}
          />
        </Holder>
        <GroupDetailsList
          items={[ // selectedIndex determins order in array
            group.users,
            group.schedules,
            group.events,
          ]}
          selectedIndex={this.state.selectedIndex}
          networkStatus={networkStatus}
          refetch={this.onRefresh}
        />
      </Container>
    );
  }
}
GroupDetails.propTypes = {
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  joinGroupQry: PropTypes.func,
  leaveGroupQry: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
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
          users: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              username: PropTypes.string.isRequired,
              displayName: PropTypes.string.isRequired,
            }),
          ),
          schedules: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              details: PropTypes.string.isRequired,
              startTime: PropTypes.number.isRequired,
              endTime: PropTypes.number.isRequired,
            }),
          ),
          events: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              details: PropTypes.string.isRequired,
            }),
          ),
        }),
      ),
    }),
  }),
};

const groupQuery = graphql(SEARCH_GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const joinGroupMutation = graphql(JOIN_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    joinGroupQry: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        update: (store, { data: { addUserToGroup } }) => {
          // fetch data from the cache
          const data = store.readQuery({
            query: CURRENT_USER_QUERY,
          });
          // add new data to the cache
          data.user.groups.push(addUserToGroup);
          data.user.schedules = _.concat(data.user.schedules, addUserToGroup.schedules);
          data.user.events = _.concat(data.user.events, addUserToGroup.events);

          // write out cache
          store.writeQuery({
            query: CURRENT_USER_QUERY,
            data,
          });
        },
      }),
  }),
});

const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    leaveGroupQry: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        refetchQueries: [{
          query: CURRENT_USER_QUERY,
        }],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupQuery,
  joinGroupMutation,
  leaveGroupMutation,
)(GroupDetails);
