import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import UserTable from './components/UserTable';
import Message from '../../../components/Messages/Message';
import SpreadPanel from '../../../components/Panels/SpreadPanel';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

import styles from '../../../styles/AppStyle';

class ViewUsers extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'name',
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
    const { classes, orgUser } = this.props;
    const { order, orderBy } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const users = orgUser.organisation.users;

    console.log(users);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <SpreadPanel>
            <Typography variant="title">Users</Typography>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          {users.length > 0 ? (
            <UserTable users={users} order={order} orderBy={orderBy} onSort={this.onSort} />
          ) : (
            <Message>No users found.</Message>
          )}
        </Paper>
      </div>
    );
  }
}

ViewUsers.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
};

const orgQuery = graphql(CURRENT_ORG_QUERY, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, orgUser } }) => ({
    loading,
    networkStatus,
    refetch,
    orgUser,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  orgQuery,
)(ViewUsers);
