import React from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import { MenuItem } from 'material-ui/Menu';

class AutocompleteSelectOption extends React.Component {
  handleClick = (event) => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

const AutocompleteSelect = (props) => {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={AutocompleteSelectOption}
      noResultsText={<Typography>{'No results found'}</Typography>}
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
};

AutocompleteSelect.propTypes = {
  classes: PropTypes.shape({}).isRequired,

};

AutocompleteSelectOption.propTypes = {
  children: PropTypes.string.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  option: PropTypes.shape({}).isRequired,
};

export default AutocompleteSelect;
