import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import styles from '../../../../styles/AppStyle';

import SpreadPanel from '../../../../components/Panels/SpreadPanel';

const UserHeader = ({ classes, user }) => (
  <Paper className={classes.paper}>
    <SpreadPanel>
      <div>
        <Typography variant="title" className={classes.paperTitle} gutterBottom>
          {user.displayName}
        </Typography>
      </div>
      <div />
    </SpreadPanel>
  </Paper>
);

UserHeader.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default withStyles(styles)(withRouter(UserHeader));
