/* global navigator */
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { View, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import distance from 'react-native-google-matrix';
import EVENT_QUERY from '../../graphql/event.query';
import { Container } from '../../components/Container';
import { Progress } from '../../components/Progress';
import { ListModal, TextInputModal, NumberInputModal, MapModal } from '../../components/Modal';
import { Paper } from '../../components/Paper';
import { ButtonIcon } from '../../components/Button';
import styles from './styles';

import SET_EVENT_RESPONSE_MUTATION from '../../graphql/set-event-response.mutation';
import CURRENT_USER_QUERY from '../../graphql/current-user.query';


class SetResponse extends Component {
  state = {
    mapModal: false,
    status: null,
    destination: null,
    dstToScene: null,
    timeToScene: null,
    destinationName: null,
    eta: null,
    detail: null,
    destinationsModal: false,
    etaModal: false,
    detailModal: false,
  }

  componentDidMount() {
    this.updateETAMaybe();
  }

  componentDidUpdate() {
    this.updateETAMaybe();
  }

  updateETAMaybe = () => {
    // calcualte distance with google only when we have the event and we havnt already run
    if (!this.state.dstToScene && this.props.event) {
      this.geoWatch = navigator.geolocation.getCurrentPosition(
        (position) => {
          const primary = this.props.event.eventLocations.find(location => location.name === 'scene');
          distance.get(
            {
              origin: `${position.coords.latitude}, ${position.coords.longitude}`,
              destination: `${primary.locationLatitude}, ${primary.locationLongitude}`,
            },
            (err, data) => {
              this.setState({
                dstToScene: !err ? data.distance : 'Unknown distance ',
                timeToScene: !err ? data.duration : 'unknown',
              });
            },
          );
        }, () => {
          this.setState({
            dstToScene: 'Unknown distance ',
            timeToScene: 'unknown',
          });
        },
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 15000 },
      );
    }
  }


  submitEventResponse = () => {
    const dst = (this.state.destination !== null ?
      { id: this.state.destination } : null);
    const eta = this.state.eta !== null ? moment().add(this.state.eta, 'minutes').unix() : 0;
    this.props
      .setEventResponseQuery({
        id: this.props.event.id,
        destination: dst,
        eta,
        detail: this.state.detail,
        status: this.state.status,
      })
      .then(() => {
        this.props.onClose();
      })
      .catch((error) => {
        Alert.alert('Error updating response', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  };

  handleResponse = (status) => {
    this.setState({
      status: status !== '' ? status : null,
      destinationsModal: true,
    });
  }

  handleDestination = (answer) => {
    this.setState({
      destination: answer.key,
      destinationName: answer.label,
      destinationsModal: false,
      etaModal: true,
    });
  }
  handleETAChange = (answer) => {
    this.setState({
      eta: answer !== '' ? answer : null,
    });
  }

  handleETA = () => {
    this.setState({
      etaModal: false,
      detailModal: true,
    });
  }

  handleETABack = () => {
    this.setState({
      etaModal: false,
      destinationsModal: true,
    });
  }

  handleETAClose = () => {
    this.setState({
      etaModal: false,
    });
  }

  handleDetailChange = (answer) => {
    this.setState({
      detail: answer !== '' ? answer : null,
    });
  }

  handleDetail = () => {
    this.setState({
      detailModal: false,
    }, this.submitEventResponse());
  }

  handleDetailBack = () => {
    this.setState({
      detailModal: false,
      etaModal: true,
    });
  }

  handleDetailClose = () => {
    this.setState({
      etaModal: false,
    });
  }


  handleDestinationClose = () => {
    this.setState({
      destinationsModal: false,
    });
  }

  handleUnavailable = () => {
    this.setState({
      status: 'unavailable',
    }, () => this.submitEventResponse());
  };

  handleIgnore = () => {
    this.props.onClose();
  };

  showMapModal = () => {
    // Only render if there are locations
    if (this.props.event.eventLocations.length) {
      this.setState({
        mapModal: true,
      });
    }
  }

  hideMapModal = () => {
    this.setState({
      mapModal: false,
    });
  }

  render() {
    const { event, loading } = this.props;
    if (loading && !event) {
      return (
        <Container>
          <Progress />
        </Container>
      );
    }

    return (
      <Container>
        <ScrollView>
          <Paper title={event.name} />
          <TouchableOpacity onPress={this.showMapModal}>
            <Paper title={this.state.dstToScene ? `Location (${this.state.dstToScene} - ETA ${this.state.timeToScene})` : 'Location'} text={event.eventLocations[1].detail} iconRight="map" />
          </TouchableOpacity>
          <Paper title="Situation On Scene" text={event.details} />
          <View style={styles.buttonContainer}>
            <ButtonIcon
              onPress={() => this.handleResponse('attending')}
              backgroundColor="green"
              text="Attending"
              icon="car"
            />
            <ButtonIcon
              onPress={() => this.handleUnavailable()}
              backgroundColor="red"
              text="Unavailable"
              icon="times"
            />
            <ButtonIcon
              onPress={() => this.handleResponse('tentative')}
              backgroundColor="#f46a00"
              text="Tentative"
              icon="hourglass-half"
            />
            <ButtonIcon
              onPress={() => this.handleIgnore()}
              backgroundColor="#808080"
              text="Ignore"
              icon="window-close"
            />
          </View>
        </ScrollView>
        <ListModal
          title="Select Your Destination"
          visible={this.state.destinationsModal}
          closeModal={this.handleDestinationClose}
          backModal={this.handleDestinationClose}
          onChange={this.handleDestination}
          data={event.eventLocations.map(location => ({
            key: location.id,
            label: location.name.toUpperCase(),
          }))}
        />
        <NumberInputModal
          title="Whats Your ETA?"
          placeHolder={`Number of minutes to ${this.state.destinationName}`}
          visible={this.state.etaModal}
          closeModal={this.handleETAClose}
          backModal={this.handleETABack}
          onChangeText={this.handleETAChange}
          onSave={this.handleETA}
        />
        <TextInputModal
          title="Availability Comments"
          placeHolder="Comments..."
          visible={this.state.detailModal}
          closeModal={this.handleDetailClose}
          backModal={this.handleDetailBack}
          onChangeText={this.handleDetailChange}
          onSave={this.handleDetail}
        />
        <MapModal
          title={event.eventLocations[1].detail}
          visible={this.state.mapModal}
          closeModal={this.hideMapModal}
          backModal={this.hideMapModal}
          markers={event.eventLocations.map(location => ({
            id: location.name,
            latitude: location.locationLatitude,
            longitude: location.locationLongitude,
            icon: location.icon,
          }))}
          initialRegion={event.eventLocations.find(location => location.name === 'scene')}
        />
      </Container>
    );
  }
}

SetResponse.propTypes = {
  setEventResponseQuery: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  eventId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    sourceIdentifier: PropTypes.string,
    permalink: PropTypes.string,
    eventLocations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        detail: PropTypes.string,
        icon: PropTypes.string,
        locationLatitude: PropTypes.float,
        locationLongitude: PropTypes.float,
      }),
    ),
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
        status: PropTypes.string.isRequired,
        detail: PropTypes.string,
      }),
    ),
  }),
};

const eventQuery = graphql(EVENT_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  options: ({ eventId }) => ({ variables: { eventId } }),
  props: ({ data: { loading, event, refetch } }) => ({
    loading,
    event,
    refetch,
  }),
});

const setEventResponse = graphql(SET_EVENT_RESPONSE_MUTATION, {
  props: ({ mutate }) => ({
    setEventResponseQuery: response =>
      mutate({
        variables: { response },
        refetchQueries: [
          {
            query: EVENT_QUERY,
            variables: { eventId: response.id },
          },
        ],
      }),
  }),
});

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
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

export default compose(connect(mapStateToProps), userQuery, eventQuery, setEventResponse)(
  SetResponse,
);
