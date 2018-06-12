import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { CircularProgress } from 'material-ui/Progress';
import Select from 'material-ui/Select';
import Snackbar from 'material-ui/Snackbar';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import CREATE_SCHEDULE_MUTATION from '../../../graphql/create-schedule.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from '../../../styles/AppStyle';

function getSteps() {
  return ['Select group', 'Specify details', 'Capabilities', 'Enter dates'];
}

function getStepContent(step) {
  const steps = [
    'Who will the request target?',
    'Enter a meaningful title and details for the request. Priority does nothing yet.',
    'What capabilities are required for the request?',
    'Dates can be an ongoing request with no end date or within a specified date range. e.g. a request for a weekend weather event.',
  ];
  if (step >= steps.length) {
    return 'Unknown step';
  }
  return steps[step];
}

class AddSchedule extends React.Component {
  state = {
    open: false,
    message: '',
    name: '',
    groupId: '',
    details: '',
    priority: 2,
    capability: '',
    startTime: moment()
      .add(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD[T]HH:mm'),
    endTime: moment()
      .add(3, 'day')
      .startOf('day')
      .format('YYYY-MM-DD[T]HH:mm'),
    activeStep: 0,
    useDates: false,
  };

  onGroupChange = (e) => {
    const groupId = e.target.value;
    this.setState(() => ({ groupId }));
  };

  onPriorityChange = (e) => {
    const priority = e.target.value;
    this.setState(() => ({ priority }));
  };

  onCapabilityChange = (e) => {
    const capability = e.target.value;
    this.setState(() => ({ capability }));
  };

  onNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  onDetailsChange = (e) => {
    const details = e.target.value;
    this.setState(() => ({ details }));
  };

  onStartTimeChange = (e) => {
    const startTime = e.target.value;
    this.setState(() => ({ startTime }));
  };

  onEndTimeChange = (e) => {
    const endTime = e.target.value;
    this.setState(() => ({ endTime }));
  };

  onUseDatesChange = () => {
    const useDates = !this.state.useDates;
    this.setState(() => ({ useDates }));
  };

  handleNext = () => {
    const steps = getSteps();
    if (this.state.activeStep === steps.length - 1) {
      const { name, details, useDates, startTime, endTime, groupId } = this.state;
      let startTimeUnix = 0;
      let endTimeUnix = 2147483647;
      if (useDates) {
        startTimeUnix = moment(startTime).unix();
        endTimeUnix = moment(endTime).unix();
      }
      this.props
        .createSchedule({ name, details, startTime: startTimeUnix, endTime: endTimeUnix, groupId })
        .then(() => {
          const { history } = this.props;
          history.push('/dashboard');
        })
        .catch((error) => {
          this.setState(() => ({ message: error.message, open: true }));
          setTimeout(() => {
            this.setState(() => ({ message: '', open: false }));
          }, 3000);
        });
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }
    return (
      <div className={classes.root}>
        <div className={classes.actionPanel}>
          <Typography variant="title" color="inherit" className={classes.cardTitle}>
            Add New Request
          </Typography>
        </div>
        <Paper className={classes.paperForm}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  {index === 0 && (
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="groupId" required>
                        group
                      </InputLabel>
                      <Select
                        value={this.state.groupId}
                        onChange={this.onGroupChange}
                        inputProps={{
                          name: 'groupId',
                          id: 'groupId',
                        }}
                        required
                      >
                        <MenuItem value="" key={0}>
                          <em>none</em>
                        </MenuItem>
                        {this.props.user.groups.map(group => (
                          <MenuItem value={group.id} key={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {index === 1 && (
                    <div>
                      <FormControl className={classes.formControl}>
                        <TextField
                          required
                          id="name"
                          label="title"
                          type="text"
                          margin="normal"
                          value={this.state.name}
                          onChange={this.onNameChange}
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="details"
                          label="details"
                          multiline
                          rowsMax="4"
                          value={this.state.details}
                          onChange={this.onDetailsChange}
                          className={classes.textField}
                          margin="normal"
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="priority">priority</InputLabel>
                        <Select value={this.state.priority} onChange={this.onPriorityChange}>
                          <MenuItem value="1" key={1}>
                            High
                          </MenuItem>
                          <MenuItem value="2" key={2}>
                            Medium
                          </MenuItem>
                          <MenuItem value="3" key={3}>
                            Low
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  )}
                  {index === 2 && (
                    <div>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="capability" required>
                          capability
                        </InputLabel>
                        <Select
                          value={this.state.capability}
                          onChange={this.onCapabilityChange}
                          required
                        >
                          <MenuItem value="1" key={1}>
                            Chainsaw L1 (Cross Cut)
                          </MenuItem>
                          <MenuItem value="2" key={2}>
                            Chainsaw L2 (Intermediate Felling)
                          </MenuItem>
                          <MenuItem value="3" key={3}>
                            Community First Responder Registation
                          </MenuItem>
                          <MenuItem value="4" key={4}>
                            Flood Rescue Boat Operator
                          </MenuItem>
                          <MenuItem value="5" key={5}>
                            Flood Rescue Operator Level 1
                          </MenuItem>
                          <MenuItem value="6" key={6}>
                            Flood Rescue Operator Level 2
                          </MenuItem>
                          <MenuItem value="7" key={7}>
                            Flood Rescue Operator Level 3
                          </MenuItem>
                          <MenuItem value="8" key={8}>
                            Generea Land Rescue Operator
                          </MenuItem>
                          <MenuItem value="9" key={9}>
                            Land Search
                          </MenuItem>
                          <MenuItem value="10" key={10}>
                            Storm and Water Damage - Ground
                          </MenuItem>
                          <MenuItem value="11" key={11}>
                            Storm and Water Damage - Heights
                          </MenuItem>
                          <MenuItem value="12" key={12}>
                            Vertical Rescue Operator
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  )}
                  {index === 3 && (
                    <div>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.useDates}
                            onChange={this.onUseDatesChange}
                          />
                        }
                        label="Use Dates?"
                        style={{ width: '100%' }}
                      />
                      {this.state.useDates && (
                        <div>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="starttime-local"
                              label="start time"
                              type="datetime-local"
                              value={this.state.startTime}
                              onChange={this.onStartTimeChange}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="endtime-local"
                              label="end time"
                              type="datetime-local"
                              onChange={this.onEndTimeChange}
                              value={this.state.endTime}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="raised"
                        color="primary"
                        disabled={
                          (activeStep === 0 && this.state.groupId === '') ||
                          (activeStep === 1 && this.state.name === '') ||
                          (activeStep === 2 && this.state.capability === '') ||
                          (activeStep === 3 &&
                            (this.state.useDates &&
                              this.state.startTime === '' &&
                              this.state.endTime === ''))
                        }
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.open}
          onClose={this.handleClose}
          autoHideDuration={3000}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

AddSchedule.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createSchedule: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const createSchedule = graphql(CREATE_SCHEDULE_MUTATION, {
  props: ({ mutate }) => ({
    createSchedule: ({ name, details, startTime, endTime, groupId }) =>
      mutate({
        variables: { schedule: { name, details, startTime, endTime, groupId } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), createSchedule, userQuery)(
  withRouter(AddSchedule),
);
