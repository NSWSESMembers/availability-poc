import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import { STATUS_AVAILABLE, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../../config';
import styles from './ScheduleWeekItem.styles';
import TimeLabel from '../../../../components/Labels/TimeLabel';
import { statusCount } from '../../../../selectors/status';

const ViewScheduleItem = ({ classes, user, startTime, endTime, timeSegments, onOpenModal }) => {
  const currentSegments = timeSegments.filter(
    timeSegment =>
      timeSegment.startTime >= startTime &&
      timeSegment.endTime <= endTime &&
      timeSegment.user.id === user.id,
  );

  const availableCount = statusCount(currentSegments, STATUS_AVAILABLE);
  const unavailableCount = statusCount(currentSegments, STATUS_UNAVAILABLE);
  const urgentCount = statusCount(currentSegments, STATUS_UNLESS_URGENT);

  // get first segment
  const availableSegment = currentSegments.find(segment => segment.status === STATUS_AVAILABLE);
  const unavailableSegment = currentSegments.find(segment => segment.status === STATUS_UNAVAILABLE);
  const urgentSegment = currentSegments.find(segment => segment.status === STATUS_UNLESS_URGENT);

  return (
    <TableCell
      className={`${classes.tableCell} ${availableCount === 0 &&
        unavailableCount === 0 &&
        urgentCount === 0 &&
        'opaque'}`}
      style={{ paddingRight: 0 }}
    >
      <div className={classes.flexCenter}>
        <TimeLabel
          user={user}
          status={STATUS_AVAILABLE}
          amount={availableCount}
          time={startTime}
          timeSegment={availableSegment}
          onOpenModal={onOpenModal}
          margin
        />
        <TimeLabel
          user={user}
          status={STATUS_UNAVAILABLE}
          amount={unavailableCount}
          time={startTime}
          endTime={endTime}
          timeSegment={unavailableSegment}
          onOpenModal={onOpenModal}
          margin
        />
        <TimeLabel
          user={user}
          status={STATUS_UNLESS_URGENT}
          amount={urgentCount}
          time={startTime}
          timeSegment={urgentSegment}
          onOpenModal={onOpenModal}
          margin
        />
      </div>
    </TableCell>
  );
};

ViewScheduleItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
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
