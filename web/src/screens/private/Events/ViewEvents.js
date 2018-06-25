import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CenterPanel from '../../../components/Panels/CenterPanel';
import EventTable from './components/EventTable';
import GroupSelect from '../Groups/components/GroupSelect';
import Message from '../../../components/Messages/Message';
import SpreadPanel from '../../../components/Panels/SpreadPanel';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import filterEvents from '../../../selectors/events';

import styles from '../../../styles/AppStyle';

class ViewEvents extends React.Component {
  state = {
    groupId: '',
    order: 'asc',
    orderBy: 'name',
  };

  onGroupChange = (e) => {
    const groupId = e.target.value;
    this.setState({ groupId });
  };

  onSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  onTagChange = name => (value) => {
    this.setState({
      [name]: value === null ? '' : value,
    });
  };

  render() {
    const { classes } = this.props;
    const { groupId, order, orderBy } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const filteredEvents = filterEvents(this.props.user.events, groupId, order, orderBy);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <SpreadPanel>
            <Typography variant="title">Events</Typography>
            <Button variant="raised" size="small" color="primary" component={Link} to="/events/add">
              Add New Event
            </Button>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <CenterPanel>
            <FormControl className={classes.formControlFilter}>
              <GroupSelect onChange={this.onTagChange('groupId')} value={this.state.groupId} />
            </FormControl>
          </CenterPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          {filteredEvents.length > 0 ? (
            <EventTable
              events={filteredEvents}
              order={order}
              orderBy={orderBy}
              onSort={this.onSort}
            />
          ) : (
            <Message>No events found.</Message>
          )}
        </Paper>
      </div>
    );
  }
}

ViewEvents.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    loading,
    user,
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  userQuery,
)(ViewEvents);
