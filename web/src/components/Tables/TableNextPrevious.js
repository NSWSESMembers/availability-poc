import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import styles from '../../styles/AppStyle';

import IconButton from '../Buttons/IconButton';

const TableNextPrevious = ({ hasNext, hasPrevious, pressNext, pressPrevious }) => (
  <div>
    {
      <IconButton
        disabled={!hasPrevious}
        label="Prev"
        icon="navigate_before"
        onClick={pressPrevious}
      />
    }
    {
      <IconButton
        disabled={!hasNext}
        label="Next"
        icon="navigate_next"
        onClick={pressNext}
        position="right"
      />
    }
  </div>
);

TableNextPrevious.propTypes = {
  hasNext: PropTypes.bool.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  pressNext: PropTypes.func.isRequired,
  pressPrevious: PropTypes.func.isRequired,
};

export default withStyles(styles)(TableNextPrevious);
