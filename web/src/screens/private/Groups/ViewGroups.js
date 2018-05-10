import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';


import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import GET_GROUPS_QUERY from '../../../graphql/search-group.query';

import styles from './ViewGroups.styles';
import moment from "moment/moment";
import { numbers } from "../../../constants";

class ViewGroups extends React.Component {
  state = {
    tab: 0,
    locationFilter: '',
    capabilityFilter: '',
  };

  handleSelectChange = (e, key) => {
    const { value } = e.target;
    this.setState({ [key]: value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  displayGroups = (classes, groups) => (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Group Name</TableCell>
          <TableCell>Location/HQ</TableCell>
          <TableCell>Capabilities</TableCell>
          <TableCell>Date Updated</TableCell>
          <TableCell>Date Created</TableCell>
          <TableCell>Created By</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {console.log(groups)}
        {groups.map(group => (
          <TableRow key={group.id}>
            <TableCell>
              <Link to={`/groups/${group.id}`}>{group.name}</Link>
            </TableCell>
            <TableCell>
              {group.tags.map(tag => this.displayLocationTags(classes, tag))}
            </TableCell>
            <TableCell>
              <div>
                {group.tags.map(tag => this.displayCapabilityTags(classes, tag))}
              </div>
            </TableCell>
            <TableCell>
              {moment.unix(group.updatedAt).format('LLL')}
            </TableCell>
            <TableCell>
              {moment.unix(group.createdAt).format('LLL')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  displayLocationTags = (classes, tag) => (
    tag.type === 'orgStructure' && <span key={tag.name}>{tag.name} </span>
  );

  displayCapabilityTags = (classes, tag) => (
    tag.type === 'capability' && <Chip key={tag.name} label={tag.name} className={classes.chip} />
  );

  render() {
    const { classes, loading, user } = this.props;
    const { tab } = this.state;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    return (
      <div className={classes.root}>
        {console.log(this.state)}
        {console.log(user)}
        <Paper className={classes.paper}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Tabs value={tab} onChange={this.handleTabChange}>
                <Tab label="Groups" />
                <Tab label="My Groups" />
              </Tabs>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="locationFilter">Select Location</InputLabel>
                  <Select
                    value={this.state.locationFilter}
                    onChange={e => this.handleSelectChange(e, 'locationFilter')}
                    inputProps={{
                      id: 'locationFilter',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="dog">
                      <em>doge</em>
                    </MenuItem>
                    {/*{this.props.user.groups.map(group => (*/}
                    {/*<MenuItem value={group.id} key={group.id}>*/}
                    {/*{group.name}*/}
                    {/*</MenuItem>*/}
                    {/*))}*/}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="capabilityFilter">Select Capability</InputLabel>
                  <Select
                    value={this.state.capabilityFilter}
                    onChange={e => this.handleSelectChange(e, 'capabilityFilter')}
                    inputProps={{
                      id: 'capabilityFilter',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="cat">
                      <em>Cat</em>
                    </MenuItem>
                    {/*{this.props.user.groups.map(group => (*/}
                    {/*<MenuItem value={group.id} key={group.id}>*/}
                    {/*{group.name}*/}
                    {/*</MenuItem>*/}
                    {/*))}*/}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>
          {tab === 0 && <div>Item One</div>}
          {/*{tab === 1 && <div>{this.displayGroups(classes, user.groups)}</div>}*/}
        </Paper>
      </div>
    );
  }
}

ViewGroups.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        createdAt: PropTypes.number.isRequired,
        updatedAt: PropTypes.number.isRequired,
        tags: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
          }),
        ),
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

const groupsQuery = graphql(GET_GROUPS_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user: { organisation }, networkStatus, refetch } }) => ({
    loading,
    user: { organisation },
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery, groupsQuery)(ViewGroups);
