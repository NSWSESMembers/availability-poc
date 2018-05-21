import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Search from 'material-ui-icons/Search';

import Alert from '../../../components/Alerts/Alert';

import EnhancedTableHead from '../../../components/Tables/EnhancedTableHead';

import filterSchedules from '../../../selectors/schedules';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './ViewSchedules.styles';

const columnData = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Group' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'startTime', numeric: false, disablePadding: false, label: 'Start Date' },
  { id: 'endTime', numeric: false, disablePadding: false, label: 'End Date' },
];

class ViewSchedules extends React.Component {
  state = {
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes } = this.props;
    const { groupId, name, order, orderBy } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const filteredItems = filterSchedules(this.props.user.schedules, {
      groupId,
      name,
      order,
      orderBy,
    });

    return (
      <div className={classes.root}>
        <div className={classes.actionPanel}>
          <Typography variant="title">Availability Requests</Typography>
          <div>
            <Button
              variant="raised"
              size="small"
              color="primary"
              component={Link}
              to="/schedules/add"
            >
              Add New Request
            </Button>
          </div>
        </div>
        <Paper className={classes.paper}>
          <Toolbar className={classes.tableToolbar}>
            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-end">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="groupFilter">Group</InputLabel>
                <Select
                  value={this.state.groupId}
                  onChange={this.onGroupChange}
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
            <Alert>There are no requests that match this filter.</Alert>
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
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </div>
    );
  }
}

ViewSchedules.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
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

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    loading,
    user,
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(ViewSchedules);
