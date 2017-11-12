import React from 'react';
import { Button, CheckBox, FlatList, StyleSheet, Text, View } from 'react-native';
import { Divider, Icon, List } from 'react-native-elements';

import moment from 'moment';

const styles = StyleSheet.create({
  weekHeading: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  weekHeadingText: {
    fontSize: 18
  },
  list: {
    backgroundColor: 'white'
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  dayRowLeft: {
    flexDirection: 'row'
  },
  dayName: {
    fontSize: 16,
  },
  daySubtitle: {
    color: 'orange',
    fontSize: 12
  }
});

export default class WeekAvailability extends React.Component {
  static navigationOptions = {
    title: 'My Week'
  };

  constructor(props) {
    super(props);

    this.state = {
      week: moment().startOf('week'),
      selected: new Set()
    }
  }

  render() {
    const from = this.state.week;
    const to = moment(from).endOf('week');

    // Generate some placeholder for days.
    let days = [];

    for (let i = 0; i < 7; ++i) {
      const day = moment(from).add(i, 'days');

      days.push({
        key: i,
        moment: day,
        name: day.format('dddd'),
        subtitle: 'assumed available'
      });
    }

    const noDaysSelected = (this.state.selected || new Set()).size > 0;

    return (
      <View>
        <View style={styles.weekHeading}>
          <Icon name='chevron-left' onPress={this.onPreviousWeek.bind(this)} />
          <Text style={styles.weekHeadingText}>
            {from.format('L')} to {to.format('L')}
          </Text>
          <Icon name='chevron-right' onPress={this.onNextWeek.bind(this)} />
        </View>
        <View style={styles.list}>
          <Divider />
          <FlatList data={days} renderItem={this.renderDayItem.bind(this)} />
        </View>
        <Button title='Edit selected' disabled={noDaysSelected} />
        <Button title='Save as my default' />
      </View>
    );
  }

  renderDayItem({ item }) {
    const isSelected = this.state.selected.has(item.moment);

    return (
      <View>
        <View style={styles.dayRow}>
          <View style={styles.dayRowLeft}>
            <CheckBox value={isSelected} />
            <View>
              <Text style={styles.dayName}>{item.name}</Text>
              <Text style={styles.daySubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          <Icon name='chevron-right' />
        </View>
        <Divider />
      </View>
    );
  }

  onPreviousWeek() {
    this.setState({ week: moment(this.state.week).subtract(1, 'week') });
  }

  onNextWeek() {
    this.setState({ week: moment(this.state.week).add(1, 'week') });
  }

  onToggleDay(moment, checked) {
    const selected = this.state.selected || new Set();

    if (checked) {
      selected.add(moment);
    } else {
      selected.clear(moment);
    }

    this.setState({ selected });
  }
}
