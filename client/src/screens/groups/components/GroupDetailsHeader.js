import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import IconButton from './IconButton';
import Icon from '../../../components/Icon';


const GroupDetailsHeader = ({
  groupIcon,
  groupName,
  tags,
  memberAlready,
  leaveGroup,
  joinGroup,
}) => (
  <View style={styles.topContainer}>
    <View style={styles.iconLeftHolder}>
      <Icon style={styles.icon} name={groupIcon} size={30} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.titleTextBold} numberOfLines={1}>
        {groupName}
      </Text>
      <Text style={styles.subtitleText} numberOfLines={1}>
        {tags !== '' ? tags : 'No Tags'}
      </Text>
    </View>
    <IconButton
      onPress={memberAlready ? leaveGroup : joinGroup}
      icon={memberAlready ? 'fa-sign-out' : 'fa-sign-in'}
      text={memberAlready ? 'Leave Group' : 'Join Group'}
    />
  </View>
);

GroupDetailsHeader.propTypes = {
  groupIcon: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  memberAlready: PropTypes.bool.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  joinGroup: PropTypes.func.isRequired,
};

export default GroupDetailsHeader;
