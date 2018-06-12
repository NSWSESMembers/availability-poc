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

import Message from '../../../components/Messages/Message';
<<<<<<< HEAD
import CenterPanel from '../../../components/Panels/CenterPanel';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import Tag from '../../../components/Selects/Tag';
import ScheduleTable from './components/ScheduleTable';
=======

import EnhancedTableHead from '../../../components/Tables/EnhancedTableHead';
>>>>>>> origin/master

import filterSchedules from '../../../selectors/schedules';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import { TAG_TYPE_CAPABILITY } from '../../../constants';

<<<<<<< HEAD
import styles from '../../../styles/AppStyle';
=======
const columnData = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
  { id: 'group', numeric: false, disablePadding: false, label: 'Group', enabled: true },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type', enabled: true },
  { id: 'startTime', numeric: false, disablePadding: false, label: 'Start Date', enabled: true },
  { id: 'endTime', numeric: false, disablePadding: false, label: 'End Date', enabled: true },
];
>>>>>>> origin/master

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
            <Typography variant="title">Availability</Typography>
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
<<<<<<< HEAD
=======
                  {this.props.user.groups.map(group => (
                    <MenuItem value={group.id} key={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
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
            </Grid>
          </Toolbar>

          {filteredItems.length === 0 ? (
            <Message>There are no requests that match this filter.</Message>
          ) : (
            <Table className={classes.table}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                columnData={columnData}
              />
              <TableBody>
                {filteredItems.map(schedule => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
                    </TableCell>
                    <TableCell>{schedule.group}</TableCell>
                    <TableCell>{schedule.type}</TableCell>
                    <TableCell>
                      {schedule.startTime === 0
                        ? '-'
                        : moment.unix(schedule.startTime).format('LLL')}
                    </TableCell>
                    <TableCell>
                      {schedule.endTime === 2147483647
                        ? '-'
                        : moment.unix(schedule.endTime).format('LLL')}
                    </TableCell>
                  </TableRow>
>>>>>>> origin/master
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
          {schedules.length > 0 ? (
            <ScheduleTable schedules={schedules} />
          ) : (
            <Message>No requests found.</Message>
          )}
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
    organisation: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
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
