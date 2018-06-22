import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// gql
import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';
import CREATE_GROUP_MUTATION from '../../../graphql/create-group.mutation';
import UPDATE_GROUP_MUTATION from '../../../graphql/update-group.mutation';

// components
import FormPanel from '../../../components/Panels/FormPanel';
import SpreadPanel from '../../../components/Panels/SpreadPanel';
import Tag from '../../../components/Selects/Tag';

// constants
import { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../constants';

import styles from '../../../styles/AppStyle';

class EditGroup extends React.Component {
  state = {
    id: 0,
    name: '',
    capabilities: '',
    regions: '',
    users: '',
  };

  componentDidMount() {
    if (this.props.loading === false && this.props.match.params.id !== undefined) {
      this.setInitialState(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.loading === false &&
      this.props.match.params.id !== undefined &&
      this.state.id === 0
    ) {
      this.setInitialState(nextProps);
    }
  }

  setInitialState(props) {
    const group = props.user.organisation.groups.find(
      g => g.id === parseInt(props.match.params.id, 10),
    );
    if (group !== undefined) {
      let regions = '';
      if (group.tags !== undefined) {
        regions = group.tags
          .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
          .map(tag => tag.id.toString())
          .join(',');
      }

      let capabilities = '';
      if (group.tags !== undefined) {
        capabilities = group.tags
          .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
          .map(tag => tag.id.toString())
          .join(',');
      }

      let users = '';
      if (group.users !== undefined) {
        users = group.users.map(user => user.id.toString()).join(',');
      }

      this.setState({
        id: group.id,
        name: group.name,
        regions,
        capabilities,
        users,
      });
    }
  }

  handleChange = (e, key) => {
    const value = _.get(e, 'target.value', e);
    this.setState({ [key]: value });
  };

  handleTagChange = name => (value) => {
    this.setState({
      [name]: value,
    });
  };

  cancelGroup = () => {
    const { history } = this.props;
    history.push('/groups');
  };

  saveGroup = () => {
    const { name, regions, capabilities, users } = this.state;

    let tags = [];
    let usersToAdd = [];

    if (regions !== '') {
      tags = tags.concat(regions.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (capabilities !== '') {
      tags = tags.concat(capabilities.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (users !== '') {
      usersToAdd = users.split(',').map(user => ({ id: parseInt(user, 10) }));
    }

    if (this.state.id === 0) {
      this.props
        .createGroup({
          name,
          tags,
          users: usersToAdd,
        })
        .then(() => {
          const { history } = this.props;
          history.push('/groups');
        })
        .catch((error) => {
          this.setState(() => ({ message: error.message, open: true }));
          setTimeout(() => {
            this.setState(() => ({ message: '', open: false }));
          }, 3000);
        });
    } else {
      this.props
        .updateGroup({
          id: this.state.id,
          name,
          tags,
          users: usersToAdd,
        })
        .then(() => {
          const { history } = this.props;
          history.push('/groups');
        })
        .catch((error) => {
          this.setState(() => ({ message: error.message, open: true }));
          setTimeout(() => {
            this.setState(() => ({ message: '', open: false }));
          }, 3000);
        });
    }
  };

  render() {
    const { name } = this.state;
    const { classes, loading, user } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const capabilities = user.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_CAPABILITY)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const regions = user.organisation.tags
      .filter(tag => tag.type === TAG_TYPE_ORG_STRUCTURE)
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const users = user.organisation.users.map(u => ({
      value: u.id.toString(),
      label: u.displayName,
    }));

    return (
      <div className={classes.root}>
        <Paper className={classes.paperHeader}>
          <SpreadPanel>
            <Typography variant="title">
              {this.state.id === 0 ? 'Add New' : 'Edit'} Group
            </Typography>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <FormPanel>
            <FormControl className={classes.formControl}>
              <TextField
                id="name"
                className={classes.textField}
                value={name}
                onChange={e => this.handleChange(e, 'name')}
                margin="normal"
                placeholder="Enter Group..."
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Tag
                list={regions}
                label="Regions"
                placeholder="Select..."
                onChange={this.handleTagChange('regions')}
                value={this.state.regions}
                multi
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Tag
                list={capabilities}
                label="Capabilities"
                placeholder="Select..."
                onChange={this.handleTagChange('capabilities')}
                value={this.state.capabilities}
                multi
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Tag
                list={users}
                label="Users"
                placeholder="Select..."
                onChange={this.handleTagChange('users')}
                value={this.state.users}
                multi
              />
            </FormControl>
            <div className={classes.actionContainer}>
              <Button
                variant="raised"
                color="primary"
                onClick={this.saveGroup}
                className={classes.button}
                disabled={this.state.name === ''}
              >
                Update
              </Button>
              <Button onClick={this.cancelGroup} className={classes.button}>
                Cancel
              </Button>
            </div>
          </FormPanel>
        </Paper>
      </div>
    );
  }
}

EditGroup.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  createGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    organisation: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          createdAt: PropTypes.number.isRequired,
          updatedAt: PropTypes.number.isRequired,
          tags: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              type: PropTypes.string.isRequired,
            }),
          ),
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
            query: CURRENT_ORG_QUERY,
          },
        ],
      }),
  }),
});

const updateGroupMutation = graphql(UPDATE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    updateGroup: ({ id, name, tags, icon, users }) =>
      mutate({
        variables: { group: { id, name, tags, icon, users } },
        refetchQueries: [
          {
            query: CURRENT_ORG_QUERY,
          },
        ],
      }),
  }),
});

const tagsQuery = graphql(CURRENT_ORG_QUERY, {
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
    user: orgUser,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  tagsQuery,
  createGroupMutation,
  updateGroupMutation,
)(EditGroup);
