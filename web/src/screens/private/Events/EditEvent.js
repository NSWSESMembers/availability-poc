import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import defaultHelos from '../../../fixtures/helos';
import defaultLhqs from '../../../fixtures/lhqs';
import defaultScenes from '../../../fixtures/scenes';

import CREATE_EVENT_MUTATION from '../../../graphql/create-event.mutation';
import UPDATE_EVENT_MUTATION from '../../../graphql/update-event.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import FormPanel from '../../../components/Panels/FormPanel';
import SpreadPanel from '../../../components/Panels/SpreadPanel';

import styles from '../../../styles/AppStyle';

function pushLocation(locations, locationToAdd) {
  if (locationToAdd !== undefined) {
    locations.push({
      name: locationToAdd.name,
      detail: locationToAdd.detail,
      icon: locationToAdd.icon,
      locationLatitude: locationToAdd.locationLatitude,
      locationLongitude: locationToAdd.locationLongitude,
    });
  }

  return locations;
}

class EditEvent extends React.Component {
  state = {
    id: 0,
    groupId: '',
    name: '',
    details: '',
    scenesList: defaultScenes,
    lhqsList: defaultLhqs,
    helosList: defaultHelos,
  };

  componentDidMount() {
    if (this.props.loading === false && this.props.match.params.id !== undefined) {
      this.setInitialState(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.loading === false &&
      nextProps.match.params.id !== undefined &&
      this.state.id === 0
    ) {
      this.setInitialState(nextProps);
    }
  }

  onGroupChange = (e) => {
    const groupId = e.target.value;
    this.setState({ groupId });
  };

  onNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  onDetailsChange = (e) => {
    const details = e.target.value;
    this.setState(() => ({ details }));
  };

  onHeloChange = (event) => {
    const helo = this.state.helosList.find(s => s.id === parseInt(event.target.value, 10));
    this.setState(() => ({ helo }));
  };

  onLHQChange = (event) => {
    const lhq = this.state.lhqsList.find(s => s.id === parseInt(event.target.value, 10));
    this.setState(() => ({ lhq }));
  };

  onSceneChange = (event) => {
    const scene = this.state.scenesList.find(s => s.id === parseInt(event.target.value, 10));
    this.setState(() => ({ scene }));
  };

  onSave = () => {
    const { id, groupId, name, details } = this.state;

    const eventLocations = [];
    pushLocation(eventLocations, this.state.scene);
    pushLocation(eventLocations, this.state.lhq);
    pushLocation(eventLocations, this.state.helo);

    if (this.state.id === 0) {
      // Add event
      this.props
        .createEvent({ name, details, eventLocations, groupId })
        .then(() => {
          const { history } = this.props;
          history.push('/events');
        })
        .catch((error) => {
          this.setState(() => ({ message: error.message, open: true }));
          setTimeout(() => {
            this.setState(() => ({ message: '', open: false }));
          }, 3000);
        });
    } else {
      // Update event
      this.props
        .updateEvent({ id, name, details, eventLocations, groupId })
        .then(() => {
          const { history } = this.props;
          history.push('/events');
        })
        .catch((error) => {
          this.setState(() => ({ message: error.message, open: true }));
          setTimeout(() => {
            this.setState(() => ({ message: '', open: false }));
          }, 3000);
        });
    }
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/events');
  }

  setInitialState(props) {
    const event = props.user.events.find(
      e => e.id === parseInt(props.match.params.id, 10),
    );

    if (event !== undefined) {
      let scene = event.eventLocations.find(s => s.icon === 'scene');
      let lhq = event.eventLocations.find(s => s.icon === 'lhq');
      let helo = event.eventLocations.find(s => s.icon === 'helo');

      const scenes = [...defaultScenes];
      const lhqs = [...defaultLhqs];
      const helos = [...defaultHelos];

      if (scene !== undefined) {
        const loc = scenes.find(
          newLoc =>
            newLoc.locationLatitude === scene.locationLatitude &&
            newLoc.locationLongitude === scene.locationLongitude,
        );
        if (loc === undefined) {
          scenes.push(scene);
        } else {
          scene = loc;
        }
      }

      if (lhq !== undefined) {
        const loc = lhqs.find(
          newLoc =>
            newLoc.locationLatitude === lhq.locationLatitude &&
            newLoc.locationLongitude === lhq.locationLongitude,
        );

        if (loc === undefined) {
          lhqs.push(lhq);
        } else {
          lhq = loc;
        }
      }

      if (helo !== undefined) {
        const loc = helos.find(
          newLoc =>
            newLoc.locationLatitude === helo.locationLatitude &&
            newLoc.locationLongitude === helo.locationLongitude,
        );

        if (loc === undefined) {
          helos.push(helo);
        } else {
          helo = loc;
        }
      }

      this.setState({
        id: event.id,
        name: event.name,
        details: event.details,
        groupId: event.group.id,
        scene,
        lhq,
        helo,
        scenesList: scenes,
        lhqsList: lhqs,
        helosList: helos,
      });
    }
  }

  render() {
    const { classes } = this.props;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paperHeader}>
          <SpreadPanel>
            <Typography variant="title">
              {this.state.id === 0 ? 'Add New' : 'Edit'} Event
            </Typography>
          </SpreadPanel>
        </Paper>
        <Paper className={classes.paperMargin}>
          <FormPanel>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="groupId" required>
                group
              </InputLabel>
              <Select
                value={this.state.groupId}
                onChange={this.onGroupChange}
                inputProps={{
                  name: 'groupId',
                  id: 'groupId',
                }}
                required
              >
                <MenuItem value="" key={0}>
                  <em>none</em>
                </MenuItem>
                {this.props.user.groups.map(group => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                required
                id="name"
                label="name"
                type="text"
                margin="normal"
                value={this.state.name}
                onChange={this.onNameChange}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                required
                id="details"
                label="details"
                multiline
                rowsMax="4"
                value={this.state.details}
                onChange={this.onDetailsChange}
                className={classes.textField}
                margin="normal"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scene" required>
                Scene
              </InputLabel>
              <Select
                value={this.state.scene !== undefined ? this.state.scene.id : ''}
                onChange={this.onSceneChange}
                required
              >
                <MenuItem value={0}>
                  <em>none</em>
                </MenuItem>
                {this.state.scenesList.map(option => (
                  <MenuItem
                    value={option.id}
                    key={`${this.state.id}-scene-${option.id}`}
                  >
                    {option.detail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="lhq">Local HQ</InputLabel>
              <Select
                value={this.state.lhq !== undefined ? this.state.lhq.id : ''}
                onChange={this.onLHQChange}
              >
                <MenuItem value={0}>
                  <em>none</em>
                </MenuItem>
                {this.state.lhqsList.map(option => (
                  <MenuItem value={option.id} key={`${this.state.id}-lhq-${option.id}`}>
                    {option.detail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="helo">Helo</InputLabel>
              <Select
                value={this.state.helo !== undefined ? this.state.helo.id : ''}
                onChange={this.onHeloChange}
              >
                <MenuItem value={0}>
                  <em>none</em>
                </MenuItem>
                {this.state.helosList.map(option => (
                  <MenuItem
                    value={option.id}
                    key={`${this.state.id}-helo-${option.id}`}
                  >
                    {option.detail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className={classes.actionContainer}>
              <Button
                variant="raised"
                color="primary"
                onClick={this.onSave}
                className={classes.button}
                disabled={this.state.groupId === '' || this.state.name === ''}
              >
                Update
              </Button>
              <Button
                onClick={this.onCancel}
                className={classes.button}
              >
                Cancel
              </Button>
            </div>
          </FormPanel>
        </Paper>
      </div>
    );
  }
}

EditEvent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
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

const createEvent = graphql(CREATE_EVENT_MUTATION, {
  props: ({ mutate }) => ({
    createEvent: ({ name, details, sourceIdentifier, permalink, eventLocations, groupId }) =>
      mutate({
        variables: {
          event: { name, details, sourceIdentifier, permalink, eventLocations, groupId },
        },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const updateEvent = graphql(UPDATE_EVENT_MUTATION, {
  props: ({ mutate }) => ({
    updateEvent: ({ id, name, details, sourceIdentifier, permalink, eventLocations, groupId }) =>
      mutate({
        variables: {
          event: { id, name, details, sourceIdentifier, permalink, eventLocations, groupId },
        },
        refetchQueries: [
          {
            query: CURRENT_USER_QUERY,
          },
        ],
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  createEvent,
  updateEvent,
  userQuery,
)(EditEvent);
