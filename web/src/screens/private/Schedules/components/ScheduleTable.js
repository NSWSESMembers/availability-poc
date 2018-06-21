import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';

import styles from '../../../../styles/AppStyle';

import EnhancedTableHead from '../../../../components/Tables/EnhancedTableHead';

import numbers from '../../../../constants';

const columnData = [
  { id: 'type', numeric: false, disablePadding: false, label: 'Type', enabled: true },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
  { id: 'group', numeric: false, disablePadding: false, label: 'Group', enabled: false },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date', enabled: false },
];

const ScheduleTable = ({ onSort, order, orderBy, schedules }) => (
  <Table>
    <EnhancedTableHead
      order={order}
      orderBy={orderBy}
      onRequestSort={onSort}
      columnData={columnData}
    />
    <TableBody>
      {schedules.map(schedule => (
        <TableRow key={schedule.id}>
          <TableCell>{schedule.type}</TableCell>
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
            {schedule.endTime !== numbers.distantFuture &&
              ` - ${moment.unix(schedule.endTime).format('LL')}`}
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
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
};

export default withStyles(styles)(ScheduleTable);
