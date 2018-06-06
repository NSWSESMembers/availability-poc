import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';
import styles from '../../styles/AppStyle';

const TableNextPrevious = ({ classes, hasNext, hasPrevious, pressNext, pressPrevious }) => (
  <div>
    {
      <Button
        size="small"
        variant="raised"
        color="primary"
        className={classes.button}
        onClick={pressPrevious}
        disabled={!hasPrevious}
      >
        Previous
      </Button>
    }
    {
      <Button
        size="small"
        variant="raised"
        color="primary"
        className={classes.button}
        onClick={pressNext}
        disabled={!hasNext}
      >
        Next
      </Button>
    }
  </div>
);

TableNextPrevious.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  hasNext: PropTypes.bool.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  pressNext: PropTypes.func.isRequired,
  pressPrevious: PropTypes.func.isRequired,
};

export default withStyles(styles)(TableNextPrevious);
