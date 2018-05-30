import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

// material ui
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';

// css
import 'react-select/dist/react-select.css';

// gql
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import CURRENT_ORG_QUERY from '../../../graphql/current-org.query';
import CREATE_GROUP_MUTATION from '../../../graphql/create-group.mutation';
import UPDATE_GROUP_MUTATION from '../../../graphql/update-group.mutation';

// components
import Tag from '../../../components/Selects/Tag';

import styles from './EditGroup.styles';

class EditGroup extends React.Component {
  state = {
    id: 0,
    name: '',
    capabilities: '',
    regions: '',
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.loading === false &&
      nextProps.match.params.id !== undefined &&
      this.state.id === 0
    ) {
      const group = nextProps.user.organisation.groups.find(
        g => g.id === parseInt(this.props.match.params.id, 10),
      );
      if (group !== undefined) {
        let regions = '';
        if (group.tags !== undefined) {
          regions = group.tags
            .filter(tag => tag.type === 'orgStructure')
            .map(tag => tag.id.toString())
            .join(',');
        }

        let capabilities = '';
        if (group.tags !== undefined) {
          capabilities = group.tags
            .filter(tag => tag.type === 'capability')
            .map(tag => tag.id.toString())
            .join(',');
        }

        this.setState({
          id: group.id,
          name: group.name,
          regions,
          capabilities,
        });
      }
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

  saveGroup = () => {
    const { name, regions, capabilities } = this.state;

    let tags = [];

    if (regions !== '') {
      tags = tags.concat(regions.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (capabilities !== '') {
      tags = tags.concat(capabilities.split(',').map(tag => ({ id: parseInt(tag, 10) })));
    }

    if (this.state.id === 0) {
      this.props
        .createGroup({
          name,
          tags,
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
      .filter(tag => tag.type === 'capability')
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

    const regions = user.organisation.tags
      .filter(tag => tag.type === 'orgStructure')
      .map(tag => ({ value: tag.id.toString(), label: tag.name }));

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
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Tag
                list={capabilities}
                label="Capabilities"
                placeholder="Select..."
                onChange={this.handleTagChange('capabilities')}
                value={this.state.capabilities}
              />
            </FormControl>
            <div className={classes.actionsContainer}>
              <Button
                variant="raised"
                color="primary"
                onClick={this.saveGroup}
                className={classes.button}
                disabled={this.state.name === ''}
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
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
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
        }),
      ),
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
            query: CURRENT_USER_QUERY,
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
            query: CURRENT_USER_QUERY,
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

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  tagsQuery,
  createGroupMutation,
  updateGroupMutation,
)(EditGroup);
