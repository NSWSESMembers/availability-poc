import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';

import styles from './DisplayRequests.styles';

import numbers from '../constants';

const DisplayRequests = ({ classes, user }) => {
  if (!user.groups.length) {
    return (
      <Paper>
        <Typography component="p" align="center">
          You are currently not assigned to any groups.{' '}
          <Link to="/groups">Click here to join groups</Link>
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Typography variant="title">Requests</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.schedules.map(schedule => (
            <TableRow key={schedule.id}>
              <TableCell>
                <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
              </TableCell>
              <TableCell>{schedule.group.name}</TableCell>
              <TableCell>
                {schedule.startTime === numbers.distantPast
                  ? 'Ongoing'
                  : moment.unix(schedule.startTime).format('LLL')}
              </TableCell>
              <TableCell>
                {schedule.endTime === numbers.distantFuture
                  ? '-'
                  : moment.unix(schedule.endTime).format('LLL')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

DisplayRequests.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
      }),
    ),
  }),
};

export default withStyles(styles)(DisplayRequests);
