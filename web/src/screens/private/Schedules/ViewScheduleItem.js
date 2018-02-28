import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';

import styles from './ViewScheduleItem.styles';

import TimeLabel from './TimeLabel';

const ViewScheduleItem = ({ classes, userId, startTime, endTime, timeSegments }) => {
  const userSegments = timeSegments.filter(
    timeSegment => timeSegment.startTime >= startTime && timeSegment.endTime < endTime,
  );

  if (userSegments.length === 0) {
    return <TableCell className={classes.tableCell} />;
  }

  return (
    <TableCell key={userId} className={classes.tableCell}>
      {timeSegments
        .filter(
          timeSegment => timeSegment.startTime >= startTime && timeSegment.startTime < endTime,
        )
        .map(userSegment => (
          <div key={`${userSegment.user.id}-${userSegment.startTime}`}>
            <TimeLabel
              status={userSegment.status}
              startTime={userSegment.startTime}
              endTime={userSegment.endTime}
            />
          </div>
        ))}
    </TableCell>
  );
};

ViewScheduleItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  userId: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
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
