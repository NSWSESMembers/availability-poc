import React from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { withStyles } from 'material-ui/styles';
import styles from './Tag.styles';

import SelectOption from './SelectOption';

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={SelectOption}
      noResultsText={<Typography>No results found</Typography>}
      arrowRenderer={arrowProps =>
        (arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)
      }
      clearRenderer={() => <ClearIcon />}
      valueComponent={(valueProps) => {
        const { value, children, onRemove } = valueProps;

        const onDelete = (event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

SelectWrapped.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const Tag = ({ classes, label, list, placeholder, multi, onChange, value }) => (
  <TextField
    fullWidth
    name="react-select-chip-label"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    label={label}
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={{
      inputComponent: SelectWrapped,
      inputProps: {
        classes,
        multi,
        instanceId: 'react-select-chip-label',
        id: 'react-select-chip-label',
        simpleValue: true,
        options: list,
      },
    }}
  />
);

Tag.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  multi: PropTypes.bool,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

Tag.defaultProps = {
  multi: false,
};

export default withStyles(styles)(Tag);
