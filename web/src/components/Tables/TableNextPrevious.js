import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import styles from './TableNextPrevious.styles';

const TableNextPrevious = ({ classes, children, hasNext, hasPrevious, pressNext, pressPrevious }) =>
  hasNext &&
  hasPrevious && (
    <div className={classes.navPanel}>
      <div>{hasPrevious && <button onClick={pressPrevious}>Previous</button>}</div>
      <div>{children}</div>
      <div>{hasNext && <button onClick={pressNext}>Next</button>}</div>
    </div>
  );

TableNextPrevious.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
  hasNext: PropTypes.bool.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  pressNext: PropTypes.func.isRequired,
  pressPrevious: PropTypes.func.isRequired,
};

export default withStyles(styles)(TableNextPrevious);
