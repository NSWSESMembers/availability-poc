import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import styles from '../../../../styles/AppStyle';

import IconButton from '../../../../components/Buttons/IconButton';

const DayWeek = ({ dayDisabled, weekDisabled, onDay, onWeek }) => (
  <div>
    <IconButton
      disabled={dayDisabled}
      label="Day"
      icon="calendar_today"
      onClick={onDay !== undefined ? onDay : (() => {})}
    />
    <IconButton
      disabled={weekDisabled}
      label="Week"
      icon="date_range"
      onClick={onWeek !== undefined ? onWeek : (() => {})}
    />
  </div>
);

DayWeek.propTypes = {
  onDay: PropTypes.func,
  onWeek: PropTypes.func,
  dayDisabled: PropTypes.bool.isRequired,
  weekDisabled: PropTypes.bool.isRequired,
};

export default withStyles(styles)(DayWeek);
