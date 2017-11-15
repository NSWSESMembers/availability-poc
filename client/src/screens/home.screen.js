import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';

const styles = extendAppStyleSheet({
  sectionHeading: {
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  availabilityRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    flexDirection: 'row',
    padding: 6
  },
  indicator: {
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    marginLeft: 6,
    marginRight: 12,
    width: 20
  },
  available: {
    backgroundColor: '#77D353',
    borderColor: '#44A020'
  },
  unavailable: {
    backgroundColor: '#F95F62',
    borderColor: '#930000'
  },
  eventCard: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderWidth: 1,
    margin: 10,
    marginBottom: 0,
    padding: 10
  },
  eventHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventAgo: {
    color: '#333',
    fontSize: 10
  },
  eventUrgent: {
    borderColor: 'red'
  }
});

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tint }) => <Icon size={34} name='home' color={tint} />
  };

  render() {
    const availability = [
      {
        key: 0,
        name: "Fantastic Rescue",
        available: true,
        summary: "available until 12:00"
      },
      {
        key: 1,
        name: "Super-duper Storm Damage",
        available: false,
        summary: "available tomorrow"
      }
    ];

    const events = [
      {
        key: 0,
        title: "Super-important Rescue Thing",
        isUrgent: true,
        when: "5m ago",
        description: "Some people probably need some help"
      },
      {
        key: 1,
        title: "Just a Regular Old Thing",
        isUrgent: false,
        when: "1d ago",
        description: "You too can sign up to to this exciting training course!"
      }
    ]

    return (
      <View style={styles.container}>
        <View style={styles.sectionHeading}>
          <Text style={styles.h2}>My Current Availability</Text>
          <Icon size={24} name='power-off' />
        </View>
        <View>
          <FlatList
            data={availability}
            renderItem={this.renderAvailabilityItem.bind(this)}
          />
        </View>
        <View>
          <FlatList
            data={events}
            renderItem={this.renderEventItem.bind(this)}
          />
        </View>
      </View>
    );
  }

  renderAvailabilityItem({ item }) {
    const colour = item.available ? styles.available : styles.unavailable;

    return (
      <View style={styles.availabilityRow}>
        <View style={[styles.indicator, colour]} />
        <View>
          <Text style={styles.h3}>{item.name}</Text>
          <Text>{item.summary}</Text>
        </View>
      </View>
    );
  }

  renderEventItem({ item }) {
    const urgency = item.isUrgent ? styles.eventUrgent : null;

    return (
      <View style={[styles.eventCard, urgency]}>
        <View style={styles.eventHeading}>
          <Text style={styles.h4}>{item.title}</Text>
          <Text style={styles.eventAgo}>{item.when}</Text>
        </View>
        <Text>{item.description}</Text>
      </View>
    )
  }

  onOverrideAvailabilityPressed() {
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Home);
