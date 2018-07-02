import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
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

import {
  closeDeployModal,
  setDeployStartTime,
  setDeployEndTime,
  addDeployTag,
  removeDeployTag,
} from '../../../../actions/schedule';

import DatePicker from '../../../../components/Forms/DatePicker';
import FormGroupPanel from '../../../../components/Panels/FormGroupPanel';

import styles from '../../../../styles/AppStyle';

const DeployModal = ({ deploy, dispatch }) => {
  const onCloseModal = () => dispatch(closeDeployModal());
  const onChangeStartDate = e => dispatch(setDeployStartTime(moment(e.target.value).unix()));
  const onChangeEndDate = e => dispatch(setDeployEndTime(moment(e.target.value).unix()));
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
      onClose={onCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ minWidth: 300 }}
    >
      <DialogTitle id="alert-dialog-title">Deployment Details</DialogTitle>
      <DialogContent>
        <FormGroupPanel>
          <DatePicker
            label="From"
            name="deployFrom"
            value={moment.unix(deploy.startTime).format('YYYY-MM-DD')}
            onChange={onChangeStartDate}
          />
          <DatePicker
            label="To"
            name="deployTo"
            value={moment.unix(deploy.endTime).format('YYYY-MM-DD')}
            onChange={onChangeEndDate}
          />
        </FormGroupPanel>
        {deploy.tags.length > 0 && (
          <FormGroupPanel label="Capabilities">
            <FormGroup row>
              {deploy.tags.map(tag => (
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseModal} color="primary">
          Cancel
        </Button>
        <Button onClick={onCloseModal} color="primary" autoFocus>
          Deploy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeployModal.propTypes = {
  dispatch: PropTypes.func,
  deploy: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

const mapStateToProps = ({ auth, schedule }) => ({
  auth,
  deploy: schedule.deploy,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(DeployModal);
