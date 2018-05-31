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
import Button from 'material-ui/Button';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import Search from 'material-ui-icons/Search';

import Switch from 'material-ui/Switch';

import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';

import styles from './ViewGroups.styles';

import Tag from '../../../components/Selects/Tag';

import { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../constants';

import DisplayGroupsTable from './components/DisplayGroupsTable';

class ViewGroups extends React.Component {
  state = {
    tab: 0,
    locationFilter: '',
    capabilityFilter: '',
    searchFilter: '',
    allGroups: false,
  };

  handleChange = (e, key) => {
    const { value } = e.target;
    this.setState({ [key]: value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  handleSwitchChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleTagChange = name => (value) => {
    this.setState({
      [name]: value === null ? '' : value,
    });
  };

  render() {
    const { classes, loading, user } = this.props;
    const { tab, locationFilter, capabilityFilter, searchFilter } = this.state;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const allGroups = user.organisation.groups;
    const myGroups = user.groups;

    const capabilities = user.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const locations = user.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

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
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.allGroups}
                  value="allGroups"
                  onChange={this.handleSwitchChange('allGroups')}
                  color="primary"
                />
              }
              label="Only My groups"
            />
            <div>
              <FormControl className={classes.formControl}>
                <Tag
                  list={locations}
                  placeholder="Select Location"
                  onChange={this.handleTagChange('locationFilter')}
                  value={this.state.locationFilter}
                  multi={false}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Tag
                  list={capabilities}
                  placeholder="Select Capability"
                  onChange={this.handleTagChange('capabilityFilter')}
                  value={this.state.capabilityFilter}
                  multi={false}
                />
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
            </div>
          </div>
          <div className={classes.actionPanel}>
            <Tabs value={tab} onChange={this.handleTabChange}>
              <Tab label="All Groups" />
              <Tab label="My Groups" />
            </Tabs>
          </div>
          <DisplayGroupsTable
            classes={classes}
            groups={tab === 0 ? allGroups : myGroups}
            locationFilter={locationFilter}
            capabilityFilter={capabilityFilter}
            searchFilter={searchFilter}
          />
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

const orgQuery = graphql(CURRENT_ORG_QUERY, {
  options: () => ({
    variables: {
      nameFilter: '',
      typeFilter: '',
    },
  }),
  props: ({ data: { loading, networkStatus, refetch, user } }) => ({
    loading,
    networkStatus,
    refetch,
    user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), orgQuery)(ViewGroups);
