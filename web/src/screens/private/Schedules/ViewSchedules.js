import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Search from 'material-ui-icons/Search';

import CenterPanel from '../../../components/Panels/CenterPanel';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import Tag from '../../../components/Selects/Tag';
import ScheduleTable from './components/ScheduleTable';

import filterSchedules from '../../../selectors/schedules';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import { TAG_TYPE_CAPABILITY } from '../../../constants';

import styles from '../../../styles/AppStyle';

class ViewSchedules extends React.Component {
  state = {
    capabilityFilter: '',
    groupId: '',
    name: '',
    order: 'asc',
    orderBy: 'name',
  };

  onGroupChange = (e) => {
    const groupId = e.target.value;
    this.setState({ groupId });
  };

  onNameChange = (e) => {
    const name = e.target.value;
    this.setState({ name });
  };

  handleCapabilityFilter = (value) => {
    this.setState({ capabilityFilter: value });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes, orgLoading, orgUser, user, userLoading } = this.props;
    const { groupId, name, order, orderBy } = this.state;

    if (orgLoading || userLoading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const schedules = filterSchedules(user.schedules, {
      groupId,
      name,
      order,
      orderBy,
    });

    const capabilities = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <SpreadPanel>
            <Typography variant="title">Availability Requests</Typography>
            <Button
              variant="raised"
              size="small"
              color="primary"
              component={Link}
              to="/schedules/add"
            >
              Add New Request
            </Button>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <CenterPanel>
            <FormControl className={classes.formControlFilter}>
              <Select
                value={this.state.groupId}
                onChange={this.onGroupChange}
                displayEmpty
                required
                inputProps={{
                  id: 'groupFilter',
                }}
              >
                <MenuItem value="" key={0}>
                  <em>none</em>
                </MenuItem>
                {this.props.user.groups.map(group => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControlFilter}>
              <Tag
                list={capabilities}
                placeholder="Select Capability"
                onChange={this.handleCapabilityFilter}
                value={this.state.capabilityFilter}
                multi={false}
              />
            </FormControl>
            <FormControl className={classes.formControlFilter}>
              <Input
                id="nameFilter"
                startAdornment={
                  <InputAdornment position="start">
                    <Search color="disabled" />
                  </InputAdornment>
                }
                onChange={this.onNameChange}
              />
            </FormControl>
          </CenterPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <ScheduleTable schedules={schedules} />
        </Paper>
      </div>
    );
  }
}

ViewSchedules.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  orgLoading: PropTypes.bool.isRequired,
  userLoading: PropTypes.bool.isRequired,
  orgUser: PropTypes.shape({
    organisation: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
  user: PropTypes.shape({
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
      }),
    ),
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
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
    orgLoading: loading,
    networkStatus,
    refetch,
    orgUser,
  }),
});

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    userLoading: loading,
    user,
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  orgQuery,
  userQuery,
)(ViewSchedules);
