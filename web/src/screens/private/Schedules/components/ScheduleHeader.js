import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';

import Typography from 'material-ui/Typography';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

import styles from '../../../../styles/AppStyle';

import { dateScheduleLabel } from '../../../../selectors/dates';

import SpreadPanel from '../../../../components/Panels/SpreadPanel';

class ScheduleHeader extends React.Component {
  state = {
    isOpen: false,
  };

  changeState = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { classes, schedule } = this.props;
    return (
      <Paper className={classes.paper}>
        <SpreadPanel>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Link to="/schedules">
              <ChevronLeft fontSize={20} spacing={3} />
            </Link>
            <Typography variant="title" className={classes.paperTitle} gutterBottom>
              {schedule.name} - ({dateScheduleLabel(schedule.startTime, schedule.endTime)})
            </Typography>
          </div>
          <Button variant="raised" size="small" onClick={this.changeState}>
            {this.state.isOpen ? '- detail' : '+ detail'}
          </Button>
        </SpreadPanel>
        {this.state.isOpen && (
          <Typography variant="caption" gutterBottom align="center">
            {schedule.details}
          </Typography>
        )}
      </Paper>
    );
  }
}

ScheduleHeader.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ScheduleHeader);
