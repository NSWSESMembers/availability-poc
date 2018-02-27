import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import styles from './ViewScheduleItem.styles';

class ViewScheduleItem extends React.Component {
  render() {
    const { classes, userId, startTime, endTime, timeSegments } = this.props;

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
          .map((userSegment) => {
            let status = userSegment.status;

            switch (userSegment.status) {
              case 'Available':
                status = 'AV';
                break;
              case 'Unavailable':
                status = 'UN';
                break;
              case 'Unavailable - unless urgent':
                status = 'UR';
                break;
              default:
                status = 'AV';
                break;
            }

            return (
              <Chip
                key={userSegment.startTime}
                avatar={
                  <Avatar className={status === 'AV' ? classes.avatarAV : classes.avatarUN}>
                    {status}
                  </Avatar>
                }
                label={`${moment.unix(userSegment.startTime).format('h:mma')} - ${moment
                  .unix(userSegment.endTime)
                  .format('h:mma')}`}
                className={status === 'AV' ? classes.chipAV : classes.chipUN}
              />
            );
          })}
      </TableCell>
    );
  }
}

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
