import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { CircularProgress } from 'material-ui/Progress';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import defaultHelos from '../../../fixtures/helos';
import defaultLhqs from '../../../fixtures/lhqs';
import defaultScenes from '../../../fixtures/scenes';

import CREATE_EVENT_MUTATION from '../../../graphql/create-event.mutation';
import UPDATE_EVENT_MUTATION from '../../../graphql/update-event.mutation';
import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './EditEvent.styles';

function getSteps() {
  return ['Select Group', 'Event Information', 'Locations'];
}

function getStepContent(step) {
  const steps = [
    'Who will the event target?',
    'Details about the event',
    'Specify the locations for the event',
  ];
  if (step >= steps.length) {
    return 'Unknown step';
  }
  return steps[step];
}

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
    groupName: '',
    name: '',
    details: '',
    activeStep: 0,
    scenesList: defaultScenes,
    lhqsList: defaultLhqs,
    helosList: defaultHelos,
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.loading === false &&
      nextProps.match.params.id !== undefined &&
      this.state.id === 0
    ) {
      const event = nextProps.user.events.find(
        e => e.id === parseInt(this.props.match.params.id, 10),
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
          groupName: event.group.name,
          scene,
          lhq,
          helo,
          scenesList: scenes,
          lhqsList: lhqs,
          helosList: helos,
        });
      }
    }
  }

  onGroupChange = (e) => {
    const groupId = e.target.value;
    let name = '';

    const group = this.props.user.groups.find(g => g.id === parseInt(groupId, 10));
    if (group !== undefined) ({ name } = group);

    this.setState(() => ({ groupId, groupName: name }));
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

  handleNext = () => {
    const steps = getSteps();
    if (this.state.activeStep === steps.length - 1) {
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
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    return (
      <form className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div style={{ display: 'flex' }}>
              <NavLink to="/events">
                <ArrowBackIcon className={classes.cardIcon} />
              </NavLink>
              <Typography variant="title" color="inherit" className={classes.cardTitle}>
                {this.state.id === 0 ? 'Add New' : 'Edit'} Event
              </Typography>
            </div>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={this.state.id}>
                  <StepLabel>
                    {label}
                    {index === 0 && activeStep !== 0 && this.state.groupId !== 0 && <span> : {this.state.groupName}</span>}
                    {index === 1 && activeStep !== 1 && this.state.name !== '' && <span> : {this.state.name}</span>}
                  </StepLabel>
                  <StepContent>
                    <Typography>{getStepContent(index)}</Typography>
                    {index === 0 && (
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
                    )}
                    {index === 1 && (
                      <div>
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
                      </div>
                    )}
                    {index === 2 && (
                      <div>
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
                      </div>
                    )}
                    <div className={classes.actionsContainer}>
                      <Button disabled={activeStep === 0} onClick={this.handleBack}>
                        Back
                      </Button>
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                        disabled={
                          (activeStep === 0 && this.state.groupId === '') ||
                          (activeStep === 1 &&
                            (this.state.name === '' || this.state.details === '')) ||
                          (activeStep === 2 && this.state.scene === '')
                        }
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </form>
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
