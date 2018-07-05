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
import UPDATE_SCHEDULE_MUTATION from '../../../graphql/update-schedule.mutation';

import numbers, {
  TAG_TYPE_CAPABILITY,
  TAG_TYPE_ORG_STRUCTURE,
  TAG_TYPE_ORG_STRUCTURE_REQUEST,
} from '../../../constants';
import { SCHEDULE_TYPE_LOCAL, SCHEDULE_TYPE_DEPLOYMENT } from '../../../config';

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
    priority: '5',
    capabilities: '',
    locations: '',
    requestingHQ: '',
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
    const {
      id,
      priority,
      type,
      name,
      details,
      useDates,
      startTime,
      endTime,
      groupId,
      capabilities,
      locations,
      requestingHQ,
    } = this.state;
    let startTimeUnix = numbers.distantPast;
    let endTimeUnix = numbers.distantFuture;
    if (useDates) {
      startTimeUnix = moment(startTime).unix();
      endTimeUnix = moment(endTime).unix();
    }
    let tags = [];
    if (capabilities !== '') {
      tags = tags.concat(capabilities.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (locations !== '') {
      tags = tags.concat(locations.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (requestingHQ !== '') {
      tags = tags.concat(requestingHQ.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (id === 0) {
      this.props
        .createSchedule({
          priority,
          type,
          name,
          details,
          startTime: startTimeUnix,
          endTime: endTimeUnix,
          groupId,
          tags,
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
    } else {
      this.props
        .updateSchedule({
          id,
          priority,
          type,
          name,
          details,
          startTime: startTimeUnix,
          endTime: endTimeUnix,
          groupId,
          tags,
        })
        .then(() => {
          const { history } = this.props;
          history.push(`/schedules/${id}`);
        })
        .catch((error) => {
          this.setState({ message: error.message, open: true });
          setTimeout(() => {
            this.setState({ message: '', open: false });
          }, 3000);
        });
    }
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/schedules');
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onTagChange = name => (value) => {
    this.setState({
      [name]: value,
    });
  };

  setInitialState(props) {
    const schedule = props.user.schedules.find(s => s.id === parseInt(props.match.params.id, 10));
    if (schedule !== undefined) {
      let capabilities = '';
      let locations = '';
      let requestingHQ = '';
      if (schedule.tags !== undefined) {
        capabilities = schedule.tags
          .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
          .map(tag => tag.id.toString())
          .join(',');
        locations = schedule.tags
          .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
          .map(tag => tag.id.toString())
          .join(',');
        requestingHQ = schedule.tags
          .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE_REQUEST)
          .map(tag => tag.id.toString())
          .join(',');
      }

      const startTime = moment.unix(schedule.startTime).format('YYYY-MM-DD');
      const endTime = moment.unix(schedule.startTime).format('YYYY-MM-DD');

      const priority = [1, 5, 10].indexOf(schedule.priority) > -1 ? schedule.priority : 5;
      this.setState({
        id: schedule.id,
        type: schedule.type,
        name: schedule.name,
        groupId: schedule.group.id.toString(),
        details: schedule.details,
        priority: priority.toString(),
        capabilities,
        locations,
        requestingHQ,
        startTime,
        endTime,
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

    const locations = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const locationsRequest = orgUser.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE_REQUEST)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const groups = user.groups.map(group => ({ value: group.id.toString(), label: group.name }));

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
                  onChange={this.onTagChange('capabilities')}
                  value={this.state.capabilities}
                  multi
                />
              </FormControl>
            </FormGroupPanel>
            {this.state.type === SCHEDULE_TYPE_DEPLOYMENT && (
              <FormGroupPanel label="Deployment">
                <FormControl className={classes.formControl}>
                  <SchedulePriority onChange={this.onChange} value={this.state.priority} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <Tag
                    list={locations}
                    placeholder="Select Location"
                    onChange={this.onTagChange('locations')}
                    value={this.state.locations}
                    multi
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <Tag
                    list={locationsRequest}
                    placeholder="Select Requesting HQ"
                    onChange={this.onTagChange('requestingHQ')}
                    value={this.state.requestingHQ}
                  />
                </FormControl>
              </FormGroupPanel>
            )}
            <FormGroupPanel label="Dates">
              <FormLabel component="legend">
                <FormControlLabel
                  control={
                    <Switch checked={this.state.useDates} onChange={this.onUseDatesChange} />
                  }
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
            </FormGroupPanel>
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  orgLoading: PropTypes.bool.isRequired,
  orgUser: PropTypes.shape({
    organisation: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  updateSchedule: PropTypes.func.isRequired,
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
    createSchedule: ({ priority, type, name, details, startTime, endTime, groupId, tags }) =>
      mutate({
        variables: {
          schedule: { priority, type, name, details, startTime, endTime, groupId, tags },
        },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const updateSchedule = graphql(UPDATE_SCHEDULE_MUTATION, {
  props: ({ mutate }) => ({
    updateSchedule: ({ id, priority, type, name, details, startTime, endTime, groupId, tags }) =>
      mutate({
        variables: {
          schedule: { id, priority, type, name, details, startTime, endTime, groupId, tags },
        },
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
  updateSchedule,
  userQuery,
)(withRouter(AddSchedule));
