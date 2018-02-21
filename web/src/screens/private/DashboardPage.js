import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

import CURRENT_USER_QUERY from '../../graphql/current-user.query';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  actionPanel: {
    textAlign: 'right',
    paddingBottom: 10,
  },
});

const DashboardPage = props =>
  (props.loading ? (
    <div>loading...</div>
  ) : (
    <div className={props.classes.root}>
      <div className={props.classes.actionPanel}>
        <Button variant="raised" size="medium" color="primary" component={Link} to="/schedule">
          Add Schedule
        </Button>
      </div>

      <Paper className={props.classes.paper}>
        <Table className={props.classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {props.user.schedules.map(schedule => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Link to={`/schedule/${schedule.id}`}>{schedule.name}</Link>
                </TableCell>
                <TableCell>{schedule.group.name}</TableCell>
                <TableCell>{schedule.startTime === 0 ? 'Ongoing' : 'Date Range'}</TableCell>
                <TableCell>
                  {schedule.startTime === 0 ? '-' : moment.unix(schedule.startTime).format('LLL')}
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
      </Paper>
    </div>
  ));

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
  isAuthenticated: !!auth.token,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(DashboardPage);
