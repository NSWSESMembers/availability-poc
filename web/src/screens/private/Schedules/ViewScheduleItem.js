import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';

import { STATUS_AVAILABILITY, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../config';

import styles from './ViewScheduleItem.styles';

import TimeLabel from './TimeLabel';

const ViewScheduleItem = ({ classes, userId, startTime, endTime, timeSegments, onClick }) => {
  const currentSegments = timeSegments.filter(
    timeSegment =>
      timeSegment.startTime >= startTime &&
      timeSegment.endTime < endTime &&
      timeSegment.user.id === userId,
  );

  const availableCount = currentSegments.filter(
    userSegment => userSegment.status === STATUS_AVAILABILITY,
  );
  const unavailableCount = currentSegments.filter(
    userSegment => userSegment.status === STATUS_UNAVAILABLE,
  );
  const urgentCount = currentSegments.filter(
    userSegment => userSegment.status === STATUS_UNLESS_URGENT,
  );

  return (
    <TableCell className={classes.tableCell}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {availableCount === 0 ? (
          <TimeLabel status={STATUS_AVAILABILITY} onClick={onClick} />
        ) : (
          <TimeLabel status={STATUS_AVAILABILITY} onClick={onClick} />
        )}
        <TimeLabel status={STATUS_UNAVAILABLE} onClick={onClick} />
        <TimeLabel status={STATUS_UNLESS_URGENT} onClick={onClick} />
      </div>
    </TableCell>
  );

  if (currentSegments.length === 0) {
    return <TableCell className={classes.tableCell} />;
  }

  return (
    <TableCell className={classes.tableCell}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentSegments.map(userSegment => (
          <div key={`${userSegment.user.id}-${userSegment.startTime}-${userSegment.status}`}>
            <TimeLabel
              status={userSegment.status}
              startTime={userSegment.startTime}
              endTime={userSegment.endTime}
              onClick={onClick}
            />
          </div>
        ))}
      </div>
    </TableCell>
  );
};

ViewScheduleItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  userId: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
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
};

export default withStyles(styles)(ViewScheduleItem);
