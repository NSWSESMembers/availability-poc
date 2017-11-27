import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { FlatList, Text, View } from 'react-native';
import { ListItem, Separator } from '../components/List';

import availability from '../fixtures/availability';
import events from '../fixtures/events';

import { extendAppStyleSheet } from './style-sheet';

const styles = extendAppStyleSheet({
  sectionHeading: {
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => <Icon size={34} name="home" color={tintColor} />,
  };

  handleAvailabilityPress = () => {
    console.log('handle availability press');
  };

  handleEventPress = () => {
    console.log('handle event press');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeading}>
          <Text style={styles.h2}>My Current Availability</Text>
          <Icon size={24} name="power-off" />
        </View>
        <View>
          <FlatList
            data={availability}
            renderItem={({ item }) => (
              <ListItem
                text={item.name}
                summary={item.summary}
                selected={item.available}
                onPress={() => this.handleAvailabilityPress(item)}
              />
            )}
            keyExtractor={item => item.key}
            ItemSeparatorComponent={Separator}
          />
        </View>
        <View>
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <ListItem
                type="box"
                text={item.title}
                summary={item.description}
                selected={item.isUrgent}
                onPress={() => this.handleEventPress(item)}
              />
            )}
            keyExtractor={item => item.key}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Home);
