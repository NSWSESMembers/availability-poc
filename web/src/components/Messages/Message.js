import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const Message = ({ children }) => (
  <Typography component="p" align="center">
    {children}
  </Typography>
);

Message.propTypes = {
  children: PropTypes.node,
};

export default Message;
