import React from 'react';
import PropTypes from 'prop-types';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';

const Icon = function iconBuilder(props) {
  const iconClass = props.name.substr(0, props.name.indexOf('-'));
  const iconName = props.name.substr(props.name.indexOf('-') + 1);
  switch (iconClass) {
    case 'fa': return (<FontAwesome {...props} name={iconName} />);
    case 'mci': return (<MaterialCommunityIcons {...props} name={iconName} />);
    case 'mi': return (<MaterialIcons {...props} name={iconName} />);
    case 'fnd': return (<Foundation {...props} name={iconName} />);
    case 'oi': return (<Octicons {...props} name={iconName} />);

    default: return (<FontAwesome {...props} name={props.name} />);
  }
};
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Icon;
