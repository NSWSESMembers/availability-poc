import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';

const NotFoundPage = () => (
  <div>
    404 - <Link to="/">Go home</Link>
    <Button variant="raised" color="primary" type="submit">
      Login
    </Button>
  </div>
);

const mapStateToProps = (state) => {
  console.log(state);
  return { isAuthenticated: true };
};

export default connect(mapStateToProps)(NotFoundPage);
