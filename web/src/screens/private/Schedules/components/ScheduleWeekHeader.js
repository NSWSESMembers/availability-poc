import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from '../../../../styles/AppStyle';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../../config';

import { peopleCount } from '../../../../selectors/timeSegments';

import TimeCountLabel from './TimeCountLabel';

const ScheduleWeekHeader = ({ classes, schedule, columnData }) => {
  const scheduleStart = moment
    .unix(schedule.startTime)
    .startOf('day')
    .unix();
  const scheduleEnd = moment
    .unix(schedule.endTime)
    .startOf('day')
    .unix();

  return (
    <TableHead>
      <TableRow>
        {columnData.map((column) => {
          if (column.id === 'name') {
            return (
              <TableCell key={column.id} className={classes.tableCellHeaderFirst}>
                Totals
              </TableCell>
            );
          }

          if (column.startTime < scheduleStart || column.startTime > scheduleEnd) {
            return <TableCell key={column.id} className={classes.tableCellHeaderDisabled} />;
          }

          const amountAvailable = peopleCount(schedule.timeSegments, {
            status: STATUS_AVAILABLE,
            startTime: column.startTime,
            endTime: column.endTime,
          });

          const amountUnvailable = peopleCount(schedule.timeSegments, {
            status: STATUS_UNAVAILABLE,
            startTime: column.startTime,
            endTime: column.endTime,
          });

          const amountUrgent = peopleCount(schedule.timeSegments, {
            status: STATUS_UNLESS_URGENT,
            startTime: column.startTime,
            endTime: column.endTime,
          });

          return (
            <TableCell
              key={column.id}
              className={classes.tableCellHeader}
              style={{ paddingRight: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TimeCountLabel status={STATUS_AVAILABLE} amount={amountAvailable.toString()} />
                <TimeCountLabel status={STATUS_UNAVAILABLE} amount={amountUnvailable.toString()} />
                <TimeCountLabel status={STATUS_UNLESS_URGENT} amount={amountUrgent.toString()} />
              </div>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        {columnData.map((column) => {
          if (column.id === 'name') {
            return (
              <TableCell key={column.id} className={classes.tableCellHeaderFirst}>
                {column.label}
              </TableCell>
            );
          }
          return column.startTime >= scheduleStart && column.startTime <= scheduleEnd ? (
            <TableCell
              key={column.id}
              className={classes.tableCellHeader}
              style={{ paddingRight: 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Link to={`/schedules/${schedule.id}/${column.startTime}`}>{column.label}</Link>
              </div>
            </TableCell>
          ) : (
            <TableCell key={`vsi-${column.startTime}`} className={classes.tableCellHeaderDisabled}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {column.label}
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

ScheduleWeekHeader.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  columnData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ),
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string,
        }),
      ),
    }),
    timeSegments: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        users: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }),
      }),
    ),
  }),
};

export default withStyles(styles)(ScheduleWeekHeader);
