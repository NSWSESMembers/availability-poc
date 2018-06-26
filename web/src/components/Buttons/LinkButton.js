import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

import styles from './IconButton.styles';

const LinkButton = ({ label, linkTo }) => (
  <Button variant="raised" size="small" color="primary" component={Link} to={linkTo}>
    {label}
  </Button>
);

LinkButton.propTypes = {
  label: PropTypes.string,
  linkTo: PropTypes.string.isRequired,
};

export default withStyles(styles)(LinkButton);
