import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import CREATE_SCHEDULE_MUTATION from '../../graphql/create-schedule.mutation';

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: 300,
    textAlign: 'center',
  },
});

class AddSchedulePage extends React.Component {
  state = {
    open: false,
    message: '',
    name: '',
    groupId: 1,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, groupId } = this.state;
    this.props
      .createSchedule({ name, groupId })
      .then(({ data: { createSchedule: schedule } }) => {
        console.log(schedule);
      })
      .catch((error) => {
        this.setState(() => ({ message: error.message, open: true }));
        setTimeout(() => {
          this.setState(() => ({ message: '', open: false }));
        }, 3000);
      });
  };

  onNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className={this.props.classes.container}>
          <div className={this.props.classes.wrapper}>
            <TextField
              required
              fullWidth
              id="name"
              label="name"
              type="text"
              margin="normal"
              value={this.state.name}
              onChange={this.onNameChange}
            />
            <Button
              variant="raised"
              color="primary"
              className={this.props.classes.button}
              type="submit"
            >
              Add Schedule
            </Button>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={this.state.open}
              onClose={this.handleClose}
              autoHideDuration={3000}
              message={<span id="message-id">{this.state.message}</span>}
            />
          </div>
        </div>
      </form>
    );
  }
}

const createSchedule = graphql(CREATE_SCHEDULE_MUTATION, {
  props: ({ mutate }) => ({
    createSchedule: ({ name, groupId }) =>
      mutate({
        variables: { schedule: { name, groupId } },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(connect(mapStateToProps), withStyles(styles), createSchedule)(
  AddSchedulePage,
);
