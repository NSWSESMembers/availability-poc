import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';

import styles from '../../../../styles/AppStyle';

import numbers from '../../../../constants';

const ScheduleTable = ({ schedules }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Type</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Group</TableCell>
        <TableCell>Date</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {schedules.map(schedule => (
        <TableRow key={schedule.id}>
          <TableCell>
            {schedule.type}
          </TableCell>
          <TableCell>
            <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/groups/${schedule.group.id}`}>{schedule.group.name}</Link>
          </TableCell>
          <TableCell>
            {schedule.startTime === numbers.distantPast
              ? 'Ongoing'
              : moment.unix(schedule.startTime).format('LL')}
            {schedule.endTime !== numbers.distantFuture
              && ` - ${moment.unix(schedule.endTime).format('LL')}`}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

ScheduleTable.propTypes = {
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
    }),
  ),
};

export default withStyles(styles)(ScheduleTable);
