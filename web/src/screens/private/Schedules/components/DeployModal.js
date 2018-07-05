import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

import SCHEDULE_QUERY from '../../../../graphql/schedule.query';
import {
  CREATE_TIME_SEGMENT_MUTATION,
  REMOVE_TIME_SEGMENT_MUTATION,
  UPDATE_TIME_SEGMENT_MUTATION,
} from '../../../../graphql/time-segment.mutation';

import {
  clearDeployPerson,
  closeDeployModal,
  setDeploy,
  addDeployTag,
  removeDeployTag,
} from '../../../../actions/schedule';

import { TIME_SEGMENT_TYPE_DEPLOYMENT } from '../../../../config';
import { TAG_TYPE_CAPABILITY } from '../../../../constants';

import DatePicker from '../../../../components/Forms/DatePicker';
import FormGroupPanel from '../../../../components/Panels/FormGroupPanel';

import styles from '../../../../styles/AppStyle';

const DeployModal = ({
  classes,
  createTimeSegment,
  deploy,
  dispatch,
  removeTimeSegment,
  updateTimeSegment,
}) => {
  const onClose = () => dispatch(closeDeployModal());
  const onChange = (e) => {
    const { startTime, endTime, note } = deploy;
    if (e.target.name === 'note') {
      dispatch(setDeploy(startTime, endTime, e.target.value));
    }
    if (e.target.name === 'deployFrom') {
      dispatch(setDeploy(moment(e.target.value).unix(), endTime, note));
    }
    if (e.target.name === 'deployTo') {
      dispatch(setDeploy(startTime, moment(e.target.value).unix(), note));
    }
  };
  const onSave = () => {
    if (deploy.id === 0) {
      deploy.peopleSelected.forEach((id) => {
        const segment = {
          type: TIME_SEGMENT_TYPE_DEPLOYMENT,
          segmentId: deploy.id,
          userId: id,
          scheduleId: deploy.scheduleId,
          status: 'deployed',
          startTime: deploy.startTime,
          endTime: deploy.endTime,
          note: deploy.note,
        };
        createTimeSegment(segment);
      });
      dispatch(clearDeployPerson());
    } else {
      const segment = {
        type: TIME_SEGMENT_TYPE_DEPLOYMENT,
        segmentId: deploy.id,
        userId: deploy.userId,
        scheduleId: deploy.scheduleId,
        status: 'deployed',
        startTime: deploy.startTime,
        endTime: deploy.endTime,
        note: deploy.note,
      };
      updateTimeSegment(segment);
    }
    dispatch(closeDeployModal());
  };
  const onDelete = () => {
    const { id: segmentId, scheduleId } = deploy;
    removeTimeSegment({ segmentId, scheduleId }).then(() => onClose());
  };
  const onSelectTag = (e, id) => {
    if (e.target.checked) {
      dispatch(addDeployTag(id));
    } else {
      dispatch(removeDeployTag(id));
    }
  };
  return (
    <Dialog
      open={deploy.open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ minWidth: 300 }}
    >
      <DialogTitle id="alert-dialog-title">
        {deploy.id > 0 && 'Edit '}Deployment Details
      </DialogTitle>
      <DialogContent>
        <FormGroupPanel>
          <DatePicker
            label="From"
            name="deployFrom"
            value={moment.unix(deploy.startTime).format('YYYY-MM-DD')}
            onChange={onChange}
          />
          <DatePicker
            label="To"
            name="deployTo"
            value={moment.unix(deploy.endTime).format('YYYY-MM-DD')}
            onChange={onChange}
          />
        </FormGroupPanel>
        {deploy.tags.length > 0 && (
          <FormGroupPanel label="Capabilities">
            <FormGroup row>
              {deploy.tags
                .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
                .map(tag => (
                  <FormControlLabel
                    key={`tag-${tag.id}`}
                    control={
                      <Checkbox
                        checked={deploy.tagsSelected.indexOf(tag.id) > -1}
                        onChange={e => onSelectTag(e, tag.id)}
                        value={tag.id.toString()}
                      />
                    }
                    label={tag.name}
                  />
                ))}
            </FormGroup>
          </FormGroupPanel>
        )}
        <FormGroupPanel>
          <TextField
            name="note"
            label="Additional notes"
            className={classes.textField}
            value={deploy.note}
            onChange={onChange}
            margin="normal"
            multiline
          />
        </FormGroupPanel>
      </DialogContent>
      <DialogActions>
        {deploy.id > 0 && (
          <Button onClick={onDelete} color="primary">
            Delete
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" autoFocus>
          {deploy.id === 0 ? 'Deploy' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const createTimeSegment = graphql(CREATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    createTimeSegment: ({ type, userId, scheduleId, status, startTime, endTime, note }) =>
      mutate({
        variables: { timeSegment: { type, userId, scheduleId, status, startTime, endTime, note } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

const removeTimeSegment = graphql(REMOVE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    removeTimeSegment: ({ segmentId, scheduleId }) =>
      mutate({
        variables: { timeSegment: { segmentId } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

const updateTimeSegment = graphql(UPDATE_TIME_SEGMENT_MUTATION, {
  props: ({ mutate }) => ({
    updateTimeSegment: ({ type, segmentId, status, startTime, endTime, scheduleId, note }) =>
      mutate({
        variables: { timeSegment: { type, segmentId, status, startTime, endTime, note } },
        refetchQueries: [
          {
            query: SCHEDULE_QUERY,
            variables: { id: scheduleId },
          },
        ],
      }),
  }),
});

DeployModal.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createTimeSegment: PropTypes.func,
  dispatch: PropTypes.func,
  deploy: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    scheduleId: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    peopleSelected: PropTypes.arrayOf(PropTypes.number),
  }),
  removeTimeSegment: PropTypes.func,
  updateTimeSegment: PropTypes.func,
};

const mapStateToProps = ({ auth, schedule }) => ({
  auth,
  deploy: schedule.deploy,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  createTimeSegment,
  removeTimeSegment,
  updateTimeSegment,
)(DeployModal);
