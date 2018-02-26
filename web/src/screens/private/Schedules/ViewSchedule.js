import React from 'react';

import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';

import styles from './ViewSchedule.styles';

class ViewSchedule extends React.Component {
  state = {
    filter: '',
  };
  render() {
    const { classes } = this.props;
    return <Paper className={classes.root}>Schedule</Paper>;
  }
}

export default withStyles(styles)(ViewSchedule);
