import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import styles from '../../../../styles/AppStyle';

const DayWeek = ({ classes, dayDisabled, weekDisabled, onDay, onWeek }) => (
  <div>
    <Button
      size="small"
      variant="raised"
      color="primary"
      disabled={dayDisabled}
      className={classes.button}
      onClick={onDay !== undefined ? onDay : () => {}}
    >
      Day
    </Button>
    <Button
      size="small"
      variant="raised"
      color="primary"
      disabled={weekDisabled}
      className={classes.button}
      onClick={onWeek !== undefined ? onWeek : () => {}}
    >
      Week
    </Button>
  </div>
);

DayWeek.propTypes = {
  onDay: PropTypes.func,
  onWeek: PropTypes.func,
  dayDisabled: PropTypes.bool.isRequired,
  weekDisabled: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(DayWeek);
