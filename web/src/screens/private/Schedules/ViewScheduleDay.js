import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';

import SCHEDULE_QUERY from '../../../graphql/schedule.query';
import styles from '../../../styles/AppStyle';

import DayWeek from './components/DayWeek';
import ScheduleHeader from './components/ScheduleHeader';
import TableNextPrevious from '../../../components/Tables/TableNextPrevious';
import SpreadPanel from '../../../components/Panels/SpreadPanel';

class ViewScheduleDay extends React.Component {
  onNextDateRange = () => {
    console.log('next');
  };

  onPreviousDateRange = () => {
    console.log('prev');
  };

  onWeek = () => {
    const { history } = this.props;
    history.push(`/schedules/${this.props.schedule.id.toString()}`);
  };

  render() {
    const { classes, loading, schedule } = this.props;

    return loading ? (
      <CircularProgress className={classes.progress} size={50} />
    ) : (
      <div className={classes.root}>
        <ScheduleHeader schedule={schedule} />
        <Paper className={classes.paperMargin}>
          <SpreadPanel>
            <DayWeek dayDisabled weekDisabled={false} onWeek={this.onWeek} />
            <TableNextPrevious
              hasNext
              hasPrevious
              pressNext={this.onNextDateRange}
              pressPrevious={this.onPreviousDateRange}
            />
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <div>Day Detail goes here</div>
        </Paper>
      </div>
    );
  }
}

ViewScheduleDay.propTypes = {
  history: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string,
        }),
      ),
    }),
    timeSegments: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        users: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }),
      }),
    ),
  }),
};

const scheduleQuery = graphql(SCHEDULE_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ownProps => ({
    variables: { id: ownProps.match.params.id },
    // fetchPolicy: 'network-only',
  }),
  props: ({ data: { loading, schedule } }) => ({
    schedule,
    loading,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  scheduleQuery,
)(ViewScheduleDay);
