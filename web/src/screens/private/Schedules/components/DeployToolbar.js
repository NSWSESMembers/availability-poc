import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import styles from '../../../../styles/AppStyle';

import { openDeployModal } from '../../../../actions/schedule';

import DeployModal from './DeployModal';
import IconButton from '../../../../components/Buttons/IconButton';
import SpreadPanel from '../../../../components/Panels/SpreadPanel';

const DeployToolbar = ({ classes, dispatch, deploy, schedule }) => {
  const onOpenModal = () => dispatch(openDeployModal(schedule));
  return (
    <React.Fragment>
      <Toolbar
        className={
          deploy.peopleSelected.length === 0 ? classes.tableStandard : classes.tableHighlight
        }
      >
        <SpreadPanel>
          <Typography color="inherit" variant="subheading">
            {deploy.peopleSelected.length} selected
          </Typography>
          <IconButton
            label="Deploy"
            icon="local_airport"
            onClick={onOpenModal}
            disabled={deploy.peopleSelected.length === 0}
          />
        </SpreadPanel>
      </Toolbar>
      <DeployModal peopleSelected={deploy.peopleSelected.length} />
    </React.Fragment>
  );
};

DeployToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  deploy: PropTypes.shape({
    peopleSelected: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
      }),
    ),
  }),
  dispatch: PropTypes.func,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
  }),
};

const mapStateToProps = ({ schedule }) => ({
  deploy: schedule.deploy,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(DeployToolbar);
