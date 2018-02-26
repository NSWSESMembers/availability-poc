import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { NavLink, withRouter } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
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

import CREATE_SCHEDULE_MUTATION from '../../../graphql/create-schedule.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './AddSchedule.styles';

function getSteps() {
  return ['Select group', 'Specify details', 'Enter dates'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return '';
    case 1:
      return 'Enter a meaningful title and details for the request. Capabilities will be added in the future here.';
    case 2:
      return 'Dates can be an ongoing request with no end date or within a specified date range. e.g. a request for a weekend weather event.';
    default:
      return 'Unknown step';
  }
}

class AddSchedule extends React.Component {
  state = {
    open: false,
    message: '',
    name: '',
    groupId: '',
    details: '',
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
      <form className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div style={{ display: 'flex' }}>
              <NavLink to="/dashboard">
                <ArrowBackIcon className={classes.cardIcon} />
              </NavLink>
              <Typography variant="title" color="inherit" className={classes.cardTitle}>
                Add New Request
              </Typography>
            </div>
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
                      </div>
                    )}
                    {index === 2 && (
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
                            (activeStep === 2 &&
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
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.open}
          onClose={this.handleClose}
          autoHideDuration={3000}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </form>
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
