import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';

const styles = extendAppStyleSheet({
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  groupText: {
    color: '#8c8c8c',
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  groupUsername: {
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Header = () => (
  <View style={styles.header} />
);

class Member extends Component {
  render() {
    const { id, username } = this.props.member;
    return (
      <TouchableHighlight key={id}>
        <View style={styles.groupContainer}>
          <Icon name="user" size={24} color="blue" />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{username}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupUsername} />
            <Text style={styles.groupText} numberOfLines={1} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

Member.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

class Group extends Component {
  static navigationOptions = {
    title: 'Group',
    tabBarIcon: ({ tintColor }) => (
      <Icon size={24} name="group" color={tintColor} />
    ),
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => <Member member={item} />

  render() {
    const { group } = this.props.navigation.state.params;
    const tags = group.tags.map(elem => `#${elem.name}`).join(' ');

    // somehow we got here with no group
    if (!group) {
      return <Text>Error displaying group</Text>;
    }

    // render group stuff
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>{group.name}</Text>
        <Text style={styles.warning}>{tags}</Text>
        <FlatList
          data={group.users}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => <Header />}
        />
      </View>
    );
  }
}
Group.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        group: PropTypes.string.isRequired,
      }),
    }),
  }),
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Group);
