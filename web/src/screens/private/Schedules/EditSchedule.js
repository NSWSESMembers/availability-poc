import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import CREATE_SCHEDULE_MUTATION from '../../../graphql/create-schedule.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

import numbers, { TAG_TYPE_CAPABILITY } from '../../../constants';
import { SCHEDULE_TYPE_LOCAL } from '../../../config';

import DatePicker from '../../../components/Forms/DatePicker';
import FormGroupPanel from '../../../components/Panels/FormGroupPanel';
import FormPanel from '../../../components/Panels/FormPanel';
import SchedulePriority from './components/SchedulePriority';
import ScheduleType from './components/ScheduleType';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import Tag from '../../../components/Selects/Tag';
import Text from '../../../components/Forms/Text';

import styles from '../../../styles/AppStyle';

class AddSchedule extends React.Component {
  state = {
    id: 0,
    open: false,
    message: '',
    type: SCHEDULE_TYPE_LOCAL,
    name: '',
    groupId: '',
    details: '',
    priority: '2',
    capability: '',
    startTime: moment()
      .add(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD'),
    endTime: moment()
      .add(3, 'day')
      .startOf('day')
      .format('YYYY-MM-DD'),
    useDates: true,
  };

  componentDidMount() {
    if (this.props.loading === false && this.props.match.params.id !== undefined) {
      this.setInitialState(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.loading === false &&
      this.props.match.params.id !== undefined &&
      this.state.id === 0
    ) {
      this.setInitialState(nextProps);
    }
  }

  onUseDatesChange = () => {
    const useDates = !this.state.useDates;
    this.setState(() => ({ useDates }));
  };

  onSave = () => {
    const { type, name, details, useDates, startTime, endTime, groupId } = this.state;
    let startTimeUnix = numbers.distantPast;
    let endTimeUnix = numbers.distantFuture;
    if (useDates) {
      startTimeUnix = moment(startTime).unix();
      endTimeUnix = moment(endTime).unix();
    }
    this.props
      .createSchedule({
        type, name, details, startTime: startTimeUnix, endTime: endTimeUnix, groupId,
      })
      .then(() => {
        const { history } = this.props;
        history.push('/schedules');
      })
      .catch((error) => {
        this.setState({ message: error.message, open: true });
        setTimeout(() => {
          this.setState({ message: '', open: false });
        }, 3000);
      });
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/schedules');
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onTagChange = name => (value) => {
    this.setState({
      [name]: value,
    });
  };

  setInitialState(props) {
    const schedule = props.user.schedules.find(
      s => s.id === parseInt(props.match.params.id, 10),
    );
    if (schedule !== undefined) {
      let capabilities = '';
      if (schedule.tags !== undefined) {
        capabilities = schedule.tags
          .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
          .map(tag => tag.id.toString())
          .join(',');
      }

      this.setState({
        id: schedule.id,
        name: schedule.name,
        groupId: schedule.group.id.toString(),
        details: schedule.details,
        priority: schedule.priority.toString(),
        capability: capabilities,
      });
    }
  }

  render() {
    const { classes, loading, orgLoading, user, orgUser } = this.props;

    if (loading || orgLoading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const capabilities = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const groups = user.groups
      .map(group => ({ value: group.id.toString(), label: group.name }));

    return (
      <div className={classes.root}>
        <Paper className={classes.paperHeader}>
          <SpreadPanel>
            <Typography variant="title">
              {this.state.id === 0 ? 'Add New' : 'Edit'} Request
            </Typography>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <FormPanel>
            <FormGroupPanel label="Type">
              <FormControl className={classes.formControl}>
                <ScheduleType onChange={this.onChange} value={this.state.type} />
              </FormControl>
            </FormGroupPanel>
            <FormGroupPanel label="Priority">
              <FormControl className={classes.formControl}>
                <SchedulePriority onChange={this.onChange} value={this.state.priority} />
              </FormControl>
            </FormGroupPanel>
            <FormGroupPanel label="Details">
              <FormControl className={classes.formControl}>
                <Text
                  required
                  label="Title*"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Text
                  required
                  label="Details*"
                  name="details"
                  value={this.state.details}
                  onChange={this.onChange}
                />
              </FormControl>
            </FormGroupPanel>
            <FormGroupPanel label="Targets">
              <FormControl className={classes.formControl}>
                <Tag
                  list={groups}
                  placeholder="Select Group*"
                  onChange={this.onTagChange('groupId')}
                  value={this.state.groupId}
                  name="groupId"
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Tag
                  list={capabilities}
                  placeholder="Select Capability"
                  onChange={this.onTagChange('capability')}
                  value={this.state.capability}
                  multi
                />
              </FormControl>
            </FormGroupPanel>
            <FormLabel component="legend">Request Date Range
              <FormControlLabel
                control={<Switch checked={this.state.useDates} onChange={this.onUseDatesChange} />}
                label="Use Dates?"
                className={classes.formControl}
              />
              {this.state.useDates && (
                <div>
                  <FormControl className={classes.formControl}>
                    <DatePicker
                      label="start time"
                      name="startTime"
                      value={this.state.startTime}
                      onChange={this.onChange}
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <DatePicker
                      label="end time"
                      name="endTime"
                      value={this.state.endTime}
                      onChange={this.onChange}
                    />
                  </FormControl>
                </div>
              )}
            </FormLabel>
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
          </FormPanel>
        </Paper>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
  orgLoading: PropTypes.bool.isRequired,
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
    createSchedule: ({ type, name, details, startTime, endTime, groupId }) =>
      mutate({
        variables: { schedule: { type, name, details, startTime, endTime, groupId } },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const orgQuery = graphql(CURRENT_ORG_QUERY, {
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
