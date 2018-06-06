import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';

import Switch from 'material-ui/Switch';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import JOIN_GROUP_MUTATION from '../../../graphql/join-group.mutation';
import LEAVE_GROUP_MUTATION from '../../../graphql/leave-group.mutation';

import styles from '../../../styles/AppStyle';

// Components
import Message from '../../../components/Messages/Message';
import Tag from '../../../components/Selects/Tag';
import GroupTable from './components/GroupTable';
import CenterPanel from '../../../components/Panels/CenterPanel';
import SpreadPanel from '../../../components/Panels/SpreadPanel';

// Selectors
import filterGroups from '../../../selectors/groups';

import { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../constants';

class ViewGroups extends React.Component {
  state = {
    locationFilter: '',
    capabilityFilter: '',
    searchFilter: '',
    myGroups: false,
    order: 'asc',
    orderBy: 'name',
  };

  handleAdd = (id) => {
    this.props
      .joinGroup({
        groupId: id,
      })
      .catch((error) => {
        this.setState(() => ({ message: error.message, open: true }));
        setTimeout(() => {
          this.setState(() => ({ message: '', open: false }));
        }, 3000);
      });
  };

  handleRemove = (id) => {
    this.props
      .leaveGroup({
        groupId: id,
      })
      .catch((error) => {
        this.setState(() => ({ message: error.message, open: true }));
        setTimeout(() => {
          this.setState(() => ({ message: '', open: false }));
        }, 3000);
      });
  };

  handleSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSwitchChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleTagChange = name => (value) => {
    this.setState({
      [name]: value === null ? '' : value,
    });
  };

  handleChange = (e, key) => {
    const { value } = e.target;
    this.setState({ [key]: value });
  };

  render() {
    const { classes, loading, orgUser } = this.props;
    const { locationFilter, capabilityFilter, searchFilter, order, orderBy } = this.state;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    let groups = this.state.myGroups ? orgUser.groups : orgUser.organisation.groups;

    groups = filterGroups(groups, orgUser.groups, {
      locationFilter,
      capabilityFilter,
      searchFilter,
      order,
      orderBy,
    });

    const capabilities = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const locations = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <SpreadPanel>
            <Typography variant="title">Groups</Typography>
            <Button
              variant="raised"
              size="small"
              color="primary"
              component={Link}
              to="/groups/edit"
            >
              Add New Group
            </Button>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <CenterPanel>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.myGroups}
                  value="myGroups"
                  onChange={this.handleSwitchChange('myGroups')}
                  color="primary"
                />
              }
              label="Only My groups"
            />
            <FormControl className={classes.formControlFilter}>
              <Tag
                list={locations}
                placeholder="Select Location"
                onChange={this.handleTagChange('locationFilter')}
                value={this.state.locationFilter}
                multi={false}
              />
            </FormControl>
            <FormControl className={classes.formControlFilter}>
              <Tag
                list={capabilities}
                placeholder="Select Capability"
                onChange={this.handleTagChange('capabilityFilter')}
                value={this.state.capabilityFilter}
                multi={false}
              />
            </FormControl>
            <FormControl className={classes.formControlFilter}>
              <Input
                id="groupSearch"
                placeholder="Search Text..."
                onChange={e => this.handleChange(e, 'searchFilter')}
              />
            </FormControl>
          </CenterPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          {groups.length > 0 ? (
            <GroupTable
              groups={groups}
              order={order}
              orderBy={orderBy}
              handleAdd={this.handleAdd}
              handleRemove={this.handleRemove}
              handleSort={this.handleSort}
            />
          ) : (
            <Message>No groups found.</Message>
          )}
        </Paper>
      </div>
    );
  }
}

ViewGroups.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  joinGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  orgUser: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        createdAt: PropTypes.number.isRequired,
        updatedAt: PropTypes.number.isRequired,
        tags: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
  }),
};

const orgQuery = graphql(CURRENT_ORG_QUERY, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, orgUser } }) => ({
    loading,
    networkStatus,
    refetch,
    orgUser,
  }),
});

const joinGroupMutation = graphql(JOIN_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    joinGroup: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        refetchQueries: [
          {
            query: CURRENT_ORG_QUERY,
          },
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    leaveGroup: ({ groupId }) =>
      mutate({
        variables: { groupUpdate: { groupId } },
        refetchQueries: [
          {
            query: CURRENT_ORG_QUERY,
          },
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  orgQuery,
  joinGroupMutation,
  leaveGroupMutation,
)(ViewGroups);
