import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import { editDeployModal } from '../../../../actions/schedule';

import {
  STATUS_AVAILABLE,
  STATUS_UNAVAILABLE,
  STATUS_UNLESS_URGENT,
  TIME_SEGMENT_TYPE_AVAILABILITY,
  TIME_SEGMENT_TYPE_DEPLOYMENT,
} from '../../../../config';

import styles from './ScheduleWeekItem.styles';

import IconButton from '../../../../components/Buttons/IconButton';
import TimeLabel from '../../../../components/Labels/TimeLabel';

import { statusCount } from '../../../../selectors/status';

const ViewScheduleItem = ({
  classes,
  dispatch,
  user,
  schedule,
  startTime,
  endTime,
  timeSegments,
  onOpenModal,
}) => {
  const onEditDeployment = (timeSegment) => {
    dispatch(editDeployModal(schedule, timeSegment));
  };

  const deployments = timeSegments.filter(
    timeSegment =>
      timeSegment.type === TIME_SEGMENT_TYPE_DEPLOYMENT &&
      ((timeSegment.startTime >= startTime && timeSegment.startTime < endTime) ||
        (timeSegment.startTime < startTime && timeSegment.endTime >= endTime) ||
        (timeSegment.endTime >= startTime && timeSegment.endTime <= endTime)),
  );

  if (deployments.length > 0) {
    return (
      <TableCell className={`${classes.tableCell}`} style={{ paddingRight: 0 }}>
        <div className={classes.flexCenter}>
          <IconButton
            color="secondary"
            label="deployed"
            onClick={() => onEditDeployment(deployments[0])}
            icon="local_airport"
          />
        </div>
      </TableCell>
    );
  }

  const currentSegments = timeSegments.filter(
    timeSegment =>
      timeSegment.type === TIME_SEGMENT_TYPE_AVAILABILITY &&
      timeSegment.startTime >= startTime &&
      timeSegment.endTime <= endTime,
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
  dispatch: PropTypes.func,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
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
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(ViewScheduleItem);
