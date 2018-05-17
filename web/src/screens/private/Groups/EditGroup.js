import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import { FormControl } from 'material-ui/Form';
import 'react-select/dist/react-select.css';

import CURRENT_USER_QUERY from '../../../graphql/current-user.query';
import AutocompleteSelect from '../../../components/AutocompleteSelect';

import styles from './EditGroup.styles';

// class Option extends React.Component {
//   handleClick = event => {
//     this.props.onSelect(this.props.option, event);
//   };
//
//   render() {
//     const { children, isFocused, isSelected, onFocus } = this.props;
//
//     return (
//       <MenuItem
//         onFocus={onFocus}
//         selected={isFocused}
//         onClick={this.handleClick}
//         component="div"
//         style={{
//           fontWeight: isSelected ? 500 : 400,
//         }}
//       >
//         {children}
//       </MenuItem>
//     );
//   }
// }

class EditGroup extends React.Component {
  state = {
    groupName: '',
    groupLocation: '',
  };

  handleChange = (e, key) => {
    const value = _.get(e, 'target.value', e);
    this.setState({ [key]: value });
  };

  // SelectWrapped = (props) => {
  //   const { classes, ...other } = props;
  //
  //   return (
  //     <Select
  //       optionComponent={Option}
  //       noResultsText={<Typography>{'No results found'}</Typography>}
  //       arrowRenderer={arrowProps =>
  //         (arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)
  //       }
  //       clearRenderer={() => <ClearIcon />}
  //       valueComponent={(valueProps) => {
  //         const { value, children, onRemove } = valueProps;
  //
  //         const onDelete = event => {
  //           event.preventDefault();
  //           event.stopPropagation();
  //           onRemove(value);
  //         };
  //
  //         if (onRemove) {
  //           return (
  //             <Chip
  //               tabIndex={-1}
  //               label={children}
  //               className={classes.chip}
  //               deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
  //               onDelete={onDelete}
  //             />
  //           );
  //         }
  //
  //         return <div className="Select-value">{children}</div>;
  //       }}
  //       {...other}
  //     />
  //   );
  // };

  // displayCapabilityTags = (props) => {
  //
  //
  //   return (
  //     <Chip
  //       key={data.key}
  //       avatar={avatar}
  //       label={data.label}
  //       onDelete={this.handleDelete(data)}
  //       className={classes.chip}
  //     />
  //   );
  // };

  render() {
    const { groupName, groupLocation } = this.state;
    const { classes, loading, user } = this.props;
    // console.log(this.state);

    if (loading) {
      return <CircularProgress className={classes.progress} size={50} />;
    }

    const allGroups = user.organisation.groups;
    // data transform for getting all orgStructure tags of groups
    const allLocations = _.keys(_.transform(allGroups, (result, group) => {
      _.forEach(group.tags, (tag) => {
        if (tag.type === 'orgStructure') {
          result[tag.name] = true;
        }
      });
    }, {}));
    // data transform for getting all capability tags of groups
    // const allCapabilities = _.keys(_.transform(allGroups, (result, group) => {
    //   _.forEach(group.tags, (tag) => {
    //     if (tag.type === 'capability') {
    //       result[tag.name] = true;
    //     }
    //   });
    // }, {}));

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={0}
            justify="center"
          >
            <Grid item xs={12} sm={6}>
              <Toolbar disableGutters>
                <Typography variant="title">Create new group</Typography>
              </Toolbar>
              <form className={classes.container} autoComplete="off">
                <TextField
                  id="groupName"
                  label="Group name"
                  className={classes.textField}
                  value={groupName}
                  onChange={e => this.handleChange(e, 'groupName')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  value={groupLocation}
                  onChange={e => this.handleChange(e, 'groupLocation')}
                  // placeholder="Group location / HQ"
                  name="groupLocation"
                  margin="normal"
                  label="Group location / HQ"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputComponent: AutocompleteSelect,
                    inputProps: {
                      classes,
                      name: 'groupLocation',
                      instanceId: 'groupLocation',
                      multi: true,
                      simpleValue: true,
                      options: allLocations.map(location => ({ value: location, label: location })),
                    },
                  }}
                />
              </form>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

EditGroup.propTypes = {
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

export default compose(connect(mapStateToProps), withStyles(styles), userQuery)(EditGroup);
