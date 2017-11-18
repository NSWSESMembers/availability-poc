import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { compose } from 'react-apollo';
import moment from 'moment';
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

// format createdAt with moment
const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

const Header = ({ onPress, onPressFind }) => (
  <View style={styles.header}>
  </View>
);
Header.propTypes = {
};

class Member extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, username } = this.props.member;
    return (
      <TouchableHighlight
        key={id}
      >
        <View style={styles.groupContainer}>
          <Icon name="user" size={24} color={'blue'} />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName} numberOfLines={1}>{username}</Text>
              <Text style={styles.groupLastUpdated}>{id}</Text>
            </View>
            <Text style={styles.groupUsername}>
            </Text>
            <Text style={styles.groupText} numberOfLines={1}>
            </Text>
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
    tabBarIcon: ({ tintColor}) => <Icon size={24} name={'group'} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  keyExtractor = item => item.id;

  renderItem = ({ item }) => <Member member={item}/>;

  render() {
    const { group } = this.props.navigation.state.params;
   const tags = (group.tags.map((elem) => {return '#'+elem.name})).join(' ')

    // somehow we got here with no group
    if (!group) {
      return (
        <Text>"Error displaying group"</Text>
      );
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

//we might not need compose any more here. TODO://find out
export default compose(
  connect(mapStateToProps),
)(Group);
