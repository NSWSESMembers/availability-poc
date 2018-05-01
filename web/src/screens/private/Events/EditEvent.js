import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { NavLink, withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { CircularProgress } from 'material-ui/Progress';
import Select from 'material-ui/Select';
import Snackbar from 'material-ui/Snackbar';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';

import styles from './EditEvent.styles';

class EditEvent extends React.Component {
  state = {
    name: '',
    details: '',
  };

  onNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  onDetailsChange = (e) => {
    const details = e.target.value;
    this.setState(() => ({ details }));
  };

  handleSave = () => {
    console.log('save');
  };

  render() {
    const { classes } = this.props;

    if (this.props.loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    return (
      <form className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div style={{ display: 'flex' }}>
              <NavLink to="/events">
                <ArrowBackIcon className={classes.cardIcon} />
              </NavLink>
              <Typography variant="title" color="inherit" className={classes.cardTitle}>
                Add New Event
              </Typography>
            </div>
            <Stepper activeStep={0} orientation="vertical">
              <Step key={1}>
                <StepLabel>Event Information</StepLabel>
                <StepContent>
                  <Typography>Enter details about your event.</Typography>
                  <FormControl className={classes.formControl}>
                    <TextField
                      required
                      id="name"
                      label="name"
                      type="text"
                      margin="normal"
                      value={this.state.name}
                      onChange={this.onNameChange}
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <TextField
                      required
                      id="details"
                      label="details"
                      multiline
                      rowsMax="4"
                      value={this.state.details}
                      onChange={this.onDetailsChange}
                      className={classes.textField}
                      margin="normal"
                    />
                  </FormControl>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleSave}
                        className={classes.button}
                        disabled={this.state.name === '' || this.state.details === ''}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>
      </form>
    );
  }
}

EditEvent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
};

const userQuery = graphql(CURRENT_USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.token,
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    loading,
    user,
    networkStatus,
    refetch,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(EditEvent);
