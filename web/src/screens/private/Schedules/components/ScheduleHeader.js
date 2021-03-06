import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import styles from '../../../../styles/AppStyle';

import { dateScheduleLabel } from '../../../../selectors/dates';

import { TAG_TYPE_CAPABILITY } from '../../../../constants';

import IconButton from '../../../../components/Buttons/IconButton';
import SpreadPanel from '../../../../components/Panels/SpreadPanel';

class ScheduleHeader extends React.Component {
  state = {
    isOpen: false,
  };

  onEdit = () => {
    const { history, schedule } = this.props;
    history.push(`/schedules/edit/${schedule.id}`);
  };

  onShowDetail = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { classes, schedule } = this.props;
    return (
      <Paper className={classes.paper}>
        <SpreadPanel>
          <div>
            <Typography variant="title" className={classes.paperTitle} gutterBottom>
              {schedule.name} - ({dateScheduleLabel(schedule.startTime, schedule.endTime)})
            </Typography>
            <Chip label={schedule.type} className={classes.chipType} />
            {schedule.tags
              .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
              .map(tag => (
                <Chip key={`${tag.id}-chip`} label={tag.name} className={classes.chip} />
              ))}
          </div>
          <div>
            <IconButton
              label="Detail"
              icon={this.state.isOpen ? 'remove' : 'add'}
              onClick={this.onShowDetail}
            />
            <IconButton color="primary" label="Edit" icon="edit" onClick={this.onEdit} />
          </div>
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
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

export default withStyles(styles)(withRouter(ScheduleHeader));
