import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Search from 'material-ui-icons/Search';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './ViewGroups.styles';

import DisplayGroupsTable from './components/DisplayGroupsTable';

class ViewGroups extends React.Component {
  state = {
    tab: 0,
    locationFilter: '',
    capabilityFilter: '',
    searchFilter: '',
  };

  handleChange = (e, key) => {
    const { value } = e.target;
    this.setState({ [key]: value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes, loading, user } = this.props;
    const { tab, locationFilter, capabilityFilter, searchFilter } = this.state;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const allGroups = user.organisation.groups;
    const myGroups = user.groups;
    // data transform for getting all orgStructure tags of groups
    const allLocations = _.keys(
      _.transform(
        allGroups,
        (result, group) => {
          _.forEach(group.tags, (tag) => {
            if (tag.type === 'orgStructure') {
              result[tag.name] = true;
            }
          });
        },
        {},
      ),
    );
    // data transform for getting all capability tags of groups
    const allCapabilities = _.keys(
      _.transform(
        allGroups,
        (result, group) => {
          _.forEach(group.tags, (tag) => {
            if (tag.type === 'capability') {
              result[tag.name] = true;
            }
          });
        },
        {},
      ),
    );

    return (
      <div className={classes.root}>
        <div className={classes.actionPanel}>
          <Typography variant="title">Groups</Typography>
          <div>
            <Button
              variant="raised"
              size="small"
              color="primary"
              component={Link}
              to="/groups/edit"
            >
              Add New Group
            </Button>
          </div>
        </div>
        <Paper className={classes.paper}>
          <Toolbar className={classes.tableToolbar}>
            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-end">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="locationFilter">Select Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={e => this.handleChange(e, 'locationFilter')}
                  inputProps={{
                    id: 'locationFilter',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allLocations.map(location => (
                    <MenuItem value={location} key={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="capabilityFilter">Select Capability</InputLabel>
                <Select
                  value={capabilityFilter}
                  onChange={e => this.handleChange(e, 'capabilityFilter')}
                  inputProps={{
                    id: 'capabilityFilter',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allCapabilities.map(capability => (
                    <MenuItem value={capability} key={capability}>
                      {capability}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <Input
                  id="groupSearch"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search color="disabled" />
                    </InputAdornment>
                  }
                  onChange={e => this.handleChange(e, 'searchFilter')}
                />
              </FormControl>
            </Grid>
          </Toolbar>
          <div className={classes.actionPanel}>
            <Tabs value={tab} onChange={this.handleTabChange}>
              <Tab label="All Groups" />
              <Tab label="My Groups" />
            </Tabs>
          </div>
          {tab === 0 && (
            <DisplayGroupsTable
              classes={classes}
              groups={allGroups}
              locationFilter={locationFilter}
              capabilityFilter={capabilityFilter}
              searchFilter={searchFilter}
            />
          )}
          {tab === 1 && (
            <DisplayGroupsTable
              classes={classes}
              groups={myGroups}
              locationFilter={locationFilter}
              capabilityFilter={capabilityFilter}
              searchFilter={searchFilter}
            />
          )}
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(ViewGroups);
