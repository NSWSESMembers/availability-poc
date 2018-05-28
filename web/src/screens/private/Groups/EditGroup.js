import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';

import { NavLink } from 'react-router-dom';

// material ui
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { FormControl } from 'material-ui/Form';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import { InputLabel } from 'material-ui/Input';

// icons
import Search from 'material-ui-icons/Search';
import ClearIcon from 'material-ui-icons/Clear';

// css
import 'react-select/dist/react-select.css';

// gql
import GET_TAGS_QUERY from '../../../graphql/get-tags.query';
import CREATE_GROUP_MUTATION from '../../../graphql/create-group.mutation';

// components
import AutocompleteSelect from '../../../components/AutocompleteSelect';
import AddMembersDialog from './AddMembersDialog';

import styles from './EditGroup.styles';

class EditGroup extends React.Component {
  state = {
    id: 0,
    groupName: '',
    groupLocation: [],
    groupCapabilities: [],
    memberSearchText: '',
    memberSearchOpen: false,
    memberSearchResults: [],
    membersToBeAdded: [],
  };

  handleDialogOpen = () => {
    this.setState({ memberSearchOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ memberSearchOpen: false });
  };

  handleChange = (e, key) => {
    // console.log('handling change for:', key);
    // console.log('data is:', e);
    const value = _.get(e, 'target.value', e);
    this.setState({ [key]: value });
  };

  performMemberSearch = (members, searchText) => {
    const searchTextToLowerCase = searchText.toLowerCase();
    return _.filter(members, (member) => {
      const nameToLowerCase = (member.displayName).toLowerCase();
      return _.startsWith(nameToLowerCase, searchTextToLowerCase);
    });
  };

  startMemberSearch = (allMembers) => {
    const { memberSearchText } = this.state;
    const matchingNames = this.performMemberSearch(allMembers, memberSearchText);
    this.setState({ memberSearchResults: matchingNames });
    this.handleDialogOpen();
  };

  addMember = (member) => {
    this.setState({
      membersToBeAdded: [...this.state.membersToBeAdded, member],
    });
  };

  removeMember = (memberRemove) => {
    const removeMemberId = memberRemove.id;
    this.setState(prevState => ({
      membersToBeAdded: _.filter(
        prevState.membersToBeAdded, member => member.id !== removeMemberId,
      ),
    }));
  };

  createGroup = () => {
    const { groupName, groupLocation, groupCapabilities } = this.state;
    const keyMapping = { label: 'name', value: 'id', type: 'type' };
    const groupLocationRename = _.map(groupLocation, location =>
      _.transform(location, (result, value, key) => result[keyMapping[key]] = value, {}));
    const groupCapabilitiesRename = _.map(groupCapabilities, capability =>
      _.transform(capability, (result, value, key) => result[keyMapping[key]] = value, {}));


    // console.log(groupLocationRename);
    // console.log(groupCapabilitiesRename);
    // this.props.createGroup({
    //   name: groupName,
    // });
    // .then(() => {
    //   const { history } = this.props;
    // history.push('/dashboard');
    // })
    // .catch((error) => {
    //   this.setState(() => ({ message: error.message, open: true }));
    //   setTimeout(() => {
    //     this.setState(() => ({ message: '', open: false }));
    //   }, 3000);
    // });
  };

  render() {
    const {
      groupName,
      groupLocation,
      groupCapabilities,
      memberSearchText,
      memberSearchResults,
      memberSearchOpen,
      membersToBeAdded,
    } = this.state;
    const { classes, loading, user } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const allMembers = user.organisation.users;
    const allTags = user.organisation.tags;
    const allLocations = _.filter(allTags, tag => tag.type === 'orgStructure');
    const allCapabilities = _.filter(allTags, tag => tag.type === 'capability');

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div style={{ display: 'flex' }}>
              <NavLink to="/groups">
                <ArrowBackIcon className={classes.cardIcon} />
              </NavLink>
              <Typography variant="title" color="inherit" className={classes.cardTitle}>
                {this.state.id === 0 ? 'Add New' : 'Edit'} Group
              </Typography>
            </div>
            <Stepper activeStep={0} orientation="vertical">
              <Step>
                <StepLabel>
                  Group Details
                </StepLabel>
                <StepContent>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="groupId" required>
                      group
                    </InputLabel>
                    <TextField
                      id="groupName"
                      className={classes.textField}
                      value={groupName}
                      onChange={e => this.handleChange(e, 'groupName')}
                      margin="normal"
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="groupId" required>
                      Group location / HQ
                    </InputLabel>
                    <TextField
                      // todo: stop this from throwing warnings onSelect
                      fullWidth
                      value={groupLocation}
                      onChange={e => this.handleChange(e, 'groupLocation')}
                      name="groupLocation"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputComponent: AutocompleteSelect,
                        inputProps: {
                          classes,
                          name: 'groupLocation',
                          instanceId: 'groupLocation',
                          multi: true,
                          options: allLocations.map(location => (
                            { value: location.id, label: location.name, type: location.type }
                          )),
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="groupId" required>
                      Capabilities needed
                    </InputLabel>
                    <TextField
                      // todo: stop this from throwing warnings onSelect
                      fullWidth
                      value={groupCapabilities}
                      onChange={e => this.handleChange(e, 'groupCapabilities')}
                      name="groupCapabilities"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputComponent: AutocompleteSelect,
                        inputProps: {
                          classes,
                          name: 'groupCapabilities',
                          instanceId: 'groupCapabilities',
                          multi: true,
                          options: allCapabilities.map(Capability =>
                            ({ value: Capability.id, label: Capability.name, type: Capability.type })),
                        },
                      }}
                    />
                  </FormControl>
                  <div className={classes.actionsContainer}>
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={() => this.createGroup()}
                      className={classes.button}
                    >
                      Update
                    </Button>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={0}
            justify="center"
          >
            <Grid item xs={12} sm={6}>
              <form className={classes.container} autoComplete="off">
                <div className={classes.margin}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <TextField
                        margin="normal"
                        id="memberSearchText"
                        type="text"
                        value={memberSearchText}
                        onChange={e => this.handleChange(e, 'memberSearchText')}
                      />
                    </Grid>
                    <Grid item>
                      <div>
                        <IconButton
                          className={classes.button}
                          aria-label="Find members"
                          onClick={() => this.startMemberSearch(allMembers)}
                        >
                          <Search />
                        </IconButton>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <FormControl className={classes.formControl}>
                  <Typography variant="title">Group members</Typography>
                  {membersToBeAdded.length !== 0 ?
                    (
                      <Table className={classes.table}>
                        <TableBody>
                          {membersToBeAdded.map(member => (
                            <TableRow key={member.id}>
                              <TableCell>{member.displayName}</TableCell>
                              <TableCell>
                                <IconButton
                                  className={classes.button}
                                  aria-label="Remove member"
                                  onClick={() => this.removeMember(member)}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) :
                    (
                      <Typography variant="caption">No members have been added yet</Typography>
                    )
                  }
                </FormControl>
                <Grid container justify="flex-end">
                  <Grid item className={classes.bottomNav}>
                    <Button
                      className={classes.button}
                      aria-label="Create group"
                      onClick={() => this.createGroup()}
                    >
                      Create group
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
        <AddMembersDialog
          classes={classes}
          memberSearchOpen={memberSearchOpen}
          memberSearchText={memberSearchText}
          memberSearchResults={memberSearchResults}
          handleDialogClose={this.handleDialogClose}
          handleChange={this.handleChange}
          startMemberSearch={() => this.startMemberSearch(allMembers)}
          addMember={this.addMember}
          removeMember={this.removeMember}
          membersToBeAdded={membersToBeAdded}
        />
      </div>
    );
  }
}

EditGroup.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
        }),
      ),
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          email: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ),
    }),
  }),
};

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    createGroup: ({ name, tags, icon, users }) =>
      mutate({
        variables: { group: { name, tags, icon, users } },
        refetchQueries: [
          {
            query: GET_TAGS_QUERY,
          },
        ],
      }),
  }),
});

const tagsQuery = graphql(GET_TAGS_QUERY, {
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

export default compose(connect(mapStateToProps), withStyles(styles), tagsQuery, createGroupMutation)(EditGroup);
