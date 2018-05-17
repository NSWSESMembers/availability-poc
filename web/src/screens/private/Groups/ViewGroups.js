import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';


import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './ViewGroups.styles';

import DisplayGroupsTable from '../../partial/DisplayGroupsTable';

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
    const allLocations = _.keys(_.transform(allGroups, (result, group) => {
      _.forEach(group.tags, (tag) => {
        if (tag.type === 'orgStructure') {
          result[tag.name] = true;
        }
      });
    }, {}));
    // data transform for getting all capability tags of groups
    const allCapabilities = _.keys(_.transform(allGroups, (result, group) => {
      _.forEach(group.tags, (tag) => {
        if (tag.type === 'capability') {
          result[tag.name] = true;
        }
      });
    }, {}));

    return (
      <div className={classes.root}>
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
                <TextField
                  id="groupSearch"
                  label="Search groups"
                  value={searchFilter}
                  onChange={e => this.handleChange(e, 'searchFilter')}
                  className={classes.textField}
                  margin="normal"
                />
              </div>
            </Grid>
          </Grid>
          {tab === 0 &&
          <DisplayGroupsTable
            classes={classes}
            groups={allGroups}
            locationFilter={locationFilter}
            capabilityFilter={capabilityFilter}
            searchFilter={searchFilter}
          />
          }
          {tab === 1 &&
          <DisplayGroupsTable
            classes={classes}
            groups={myGroups}
            locationFilter={locationFilter}
            capabilityFilter={capabilityFilter}
            searchFilter={searchFilter}
          />
          }
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
