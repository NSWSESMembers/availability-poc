import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import EnhancedTableHead from '../../../components/Tables/EnhancedTableHead';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from '../../../styles/AppStyle';

const columnData = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
  { id: 'details', numeric: false, disablePadding: false, label: 'Details', enabled: true },
];

class ViewEvents extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'name',
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    return (
      <div className={classes.root}>
        <div className={classes.actionPanel}>
          <Typography variant="title">Events</Typography>
          <div>
            <Button
              variant="raised"
              size="small"
              color="primary"
              component={Link}
              to="/events/edit"
            >
              Add New Event
            </Button>
          </div>
        </div>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnData={columnData}
            />
            <TableBody>
              {this.props.user.events.map(event => (
                <TableRow key={event.id}>
                  <TableCell className={classes.tableCell}>
                    <Link to={`/events/edit/${event.id}`}>{event.name}</Link>
                  </TableCell>
                  <TableCell>{event.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(ViewEvents);
