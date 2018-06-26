import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from '../../../../styles/AppStyle';

import EnhancedTableHead from '../../../../components/Tables/EnhancedTableHead';

import numbers, { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../../constants';

const columnData = [
  { id: 'type', numeric: false, disablePadding: false, label: 'Type', enabled: true },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
  { id: 'group', numeric: false, disablePadding: false, label: 'Group', enabled: false },
  {
    id: 'capabilities',
    numeric: false,
    disablePadding: false,
    label: 'Capabilities',
    enabled: false,
  },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date', enabled: false },
];

const ScheduleTable = ({ classes, onSort, order, orderBy, schedules }) => {
  const displayTag = (type, schedule, tag) =>
    tag.type === type && (
      <Chip key={`${schedule.id}-${tag.id}`} label={tag.name} className={classes.chip} />
    );

  console.log(schedules);

  return (
    <Table>
      {onSort !== undefined && order !== undefined && orderBy !== undefined ? (
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={onSort}
          columnData={columnData}
        />
      ) : (
        <TableHead>
          <TableRow>
            {columnData.map(
              column => (
                <TableCell
                  key={column.id}
                  numeric={column.numeric}
                  padding={column.disablePadding ? 'none' : 'default'}
                >
                  {column.label}
                </TableCell>
              ),
              this,
            )}
          </TableRow>
        </TableHead>
      )}
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
              {schedule.tags.map(tag => displayTag(TAG_TYPE_CAPABILITY, schedule, tag))}
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
};

ScheduleTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
    }),
  ),
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onSort: PropTypes.func,
};

export default withStyles(styles)(ScheduleTable);
