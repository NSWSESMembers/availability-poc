import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import styles from './ScheduleDay.styles';

import TimeLabel from '../../../../components/Labels/TimeLabel';

const timeIncrement = 3600;
const timeLength = 24;

const ScheduleDay = ({ classes, users, day, onEdit }) => {
  // init time sequence
  const timeSplits = [];
  if (timeSplits.length === 0) {
    for (let i = 0; i < timeLength; i += 1) {
      const increment = i * timeIncrement;
      timeSplits.push(increment + day);
    }
  }

  // write header rows
  const headerRows = [];
  if (headerRows.length === 0) {
    headerRows.push(
      <th key="headerDate" className={classes.tableHeaderFirst}>
        {moment.unix(day).format('ddd, MMM D')}
      </th>,
    );
    const start = moment()
      .startOf('day')
      .add(-1, 'hours');
    timeSplits.forEach((timeSplit) => {
      headerRows.push(
        <th key={`h${timeSplit}`} className={classes.tableHeader}>
          {start.add(1, 'hours').format('ha')}
        </th>,
      );
    });
  }

  // write user rows
  const userRows = [];
  users.forEach((user) => {
    let currentSplit = day;
    let columns = 0;
    const userTimeColumns = [];
    timeSplits.forEach((timeSplit) => {
      if (currentSplit === timeSplit) {
        let colSpan = 1;

        const segment = user.timeSegments.find(
          ts => timeSplit >= ts.startTime && timeSplit + timeIncrement <= ts.endTime,
        );

        if (segment !== undefined) {
          colSpan = Math.ceil((segment.endTime - segment.startTime) / timeIncrement);
        }

        // check to see if timespan goes into next day
        if (columns + colSpan > timeSplits.length) {
          colSpan = timeSplits.length - columns;
        }

        userTimeColumns.push(
          <td key={`u${user.id}row${currentSplit}`} className={classes.tableCell} colSpan={colSpan}>
            {segment ? (
              <TimeLabel user={user} timeSegment={segment} amount={colSpan} onOpenModal={onEdit} />
            ) : (
              <div className="opaque">
                <TimeLabel user={user} amount={0} onOpenModal={onEdit} time={timeSplit} />
              </div>
            )}
          </td>,
        );
        currentSplit += colSpan * timeIncrement;
        columns += colSpan;
      }
    });

    userRows.push(
      <tr key={`user${user.id}rowname`}>
        <td className={classes.tableCellFirst}>
          <Link to={`/users/${user.id}`}>{user.displayName}</Link>
        </td>
        {userTimeColumns}
      </tr>,
    );
  });

  return (
    <table className={classes.table}>
      <thead>
        <tr>{headerRows}</tr>
      </thead>
      <tbody>{userRows}</tbody>
    </table>
  );
};

ScheduleDay.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ),
  day: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default withStyles(styles)(ScheduleDay);
