import React, { Component } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Button, ButtonNavBar } from '../../components/Button';
import { Calendar, Week } from '../../components/Calendar';
import { Container, Holder } from '../../components/Container';
import { Progress } from '../../components/Progress';
import { SeparatorClear } from '../../components/Separator';

import {
  clearAvailability,
  setSelectedDate,
  startWeekChange,
} from '../../state/availability.actions';

class Index extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Availability',
    tabBarIcon: ({ tintColor }) => <Icon size={24} name="calendar" color={tintColor} />,
    headerRight: <ButtonNavBar onPress={() => navigation.navigate('Edit')} icon="plus" />,
  });

  onChangeDate = (dt) => {
    this.props.dispatch(setSelectedDate(dt.unix()));
  };

  onPressItem = () => {
    this.props.navigation.navigate('Edit');
  };

  onScrollEnd = (e) => {
    this.props.dispatch(startWeekChange());
    const { layoutMeasurement, contentOffset } = e.nativeEvent;
    const activeIndex = Math.floor(contentOffset.x / layoutMeasurement.width);

    let dt;
    if (activeIndex === -1) {
      dt = moment
        .unix(this.props.selectedDate)
        .add(-1, 'weeks')
        .startOf('isoWeek');
    } else {
      dt = moment
        .unix(this.props.selectedDate)
        .add(1, 'weeks')
        .startOf('isoWeek');
    }
    this.props.dispatch(setSelectedDate(dt.unix()));
  };

  clearItems = () => {
    this.props.dispatch(clearAvailability());
  };

  render() {
    const momentDate = moment.unix(this.props.selectedDate);

    // get start of week unix timestamp
    const startOfWeek = momentDate
      .clone()
      .isoWeekday(1)
      .startOf('isoweek');
    const endOfWeek = momentDate
      .clone()
      .isoWeekday(1)
      .endOf('isoweek');

    // will be replaced by graphql calls
    // eslint-disable-next-line
    const filteredItems = this.props.items.filter(
      item => item.startDateTime >= startOfWeek.unix() && item.startDateTime < endOfWeek.unix(),
    );

    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Holder margin>
          <ScrollView
            horizontal
            onScrollEndDrag={this.onScrollEnd}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Week
              onChangeDate={this.onChangeDate}
              selectedDate={moment.unix(this.props.selectedDate)}
            />
          </ScrollView>
        </Holder>
        <SeparatorClear />
        {this.props.isChangingWeek && <Progress />}
        <Calendar items={filteredItems} onPressItem={this.onPressItem} />
        {filteredItems.length > 0 && (
          <Holder transparent marginBot>
            <Button onPress={this.clearItems} text="Clear All" />
          </Holder>
        )}
      </Container>
    );
  }
}

const mapStateToProps = ({ availability }) => ({
  selectedDate: availability.selectedDate,
  isChangingWeek: availability.isChangingWeek,
  items: availability.items,
});

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedDate: PropTypes.number.isRequired,
  isChangingWeek: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      startDateTime: PropTypes.number.isRequired,
      endDateTime: PropTypes.number.isRequired,
    }),
  ),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default connect(mapStateToProps)(Index);
