import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { CircularProgress } from 'material-ui/Progress';
import Select from 'material-ui/Select';
import Snackbar from 'material-ui/Snackbar';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import ChevronLeft from 'material-ui-icons/ChevronLeft';

import CREATE_SCHEDULE_MUTATION from '../../../graphql/create-schedule.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

import { TAG_TYPE_CAPABILITY } from '../../../constants';

import SpreadPanel from '../../../components/Panels/SpreadPanel';
import Tag from '../../../components/Selects/Tag';

import styles from '../../../styles/AppStyle';

class AddSchedule extends React.Component {
  state = {
    id: 0,
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

  onCapabilityChange = (value) => {
    this.setState({ capability: value });
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

  onSave = () => {
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
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/schedules');
  };

  render() {
    const { classes, orgUser } = this.props;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const capabilities = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    return (
      <div className={classes.root}>
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
              <Typography variant="title">
                {this.state.id === 0 ? 'Add New' : 'Edit'} Request
              </Typography>
            </div>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
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
            <Tag
              list={capabilities}
              placeholder="Select Capability"
              onChange={this.onCapabilityChange}
              value={this.state.capability}
              multi
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
          <div>
            <FormControlLabel
              control={<Switch checked={this.state.useDates} onChange={this.onUseDatesChange} />}
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
          <div className={classes.actionContainer}>
            <Button
              variant="raised"
              color="primary"
              onClick={this.onSave}
              className={classes.button}
              disabled={this.state.name === '' || this.state.groupId === ''}
            >
              Update
            </Button>
            <Button onClick={this.onCancel} className={classes.button}>
              Cancel
            </Button>
          </div>
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
  orgUser: PropTypes.shape({
    organisation: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
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

const orgQuery = graphql(CURRENT_ORG_QUERY, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, orgUser } }) => ({
    orgLoading: loading,
    networkStatus,
    refetch,
    orgUser,
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

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  createSchedule,
  orgQuery,
  userQuery,
)(withRouter(AddSchedule));
