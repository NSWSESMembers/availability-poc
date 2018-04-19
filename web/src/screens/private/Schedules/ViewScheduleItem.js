import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';

import { STATUS_AVAILABILITY, STATUS_UNAVAILABLE, STATUS_UNLESS_URGENT } from '../../../config';
import styles from './ViewScheduleItem.styles';
import TimeLabel from '../../../components/Labels/TimeLabel';
import { statusCount } from '../../../selectors/status';

const ViewScheduleItem = ({ classes, user, startTime, endTime, timeSegments, onOpenModal }) => {
  const currentSegments = timeSegments.filter(
    timeSegment =>
      timeSegment.startTime >= startTime &&
      timeSegment.endTime < endTime &&
      timeSegment.user.id === user.id,
  );

  const availableCount = statusCount(currentSegments, STATUS_AVAILABILITY);
  const unavailableCount = statusCount(currentSegments, STATUS_UNAVAILABLE);
  const urgentCount = statusCount(currentSegments, STATUS_UNLESS_URGENT);

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
          status={STATUS_AVAILABILITY}
          amount={availableCount}
          startTime={startTime}
          endTime={endTime}
          onOpenModal={onOpenModal}
        />
        <TimeLabel
          user={user}
          status={STATUS_UNAVAILABLE}
          amount={unavailableCount}
          startTime={startTime}
          endTime={endTime}
          onOpenModal={onOpenModal}
        />
        <TimeLabel
          user={user}
          status={STATUS_UNLESS_URGENT}
          amount={urgentCount}
          startTime={startTime}
          endTime={endTime}
          onOpenModal={onOpenModal}
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
