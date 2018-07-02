import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EnhancedTableHead from '../../../../components/Tables/EnhancedTableHead';

import { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../../constants';

import styles from '../../../../styles/AppStyle';

const columnData = [
  { id: 'action', numeric: false, disablePadding: false, label: '', enabled: false },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location', enabled: false },
  {
    id: 'capabilities',
    numeric: false,
    disablePadding: false,
    label: 'Capabilities',
    enabled: false,
  },
  {
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: 'Date Updated',
    enabled: true,
  },
];

const GroupTable = ({ classes, groups, order, orderBy, handleAdd, handleRemove, handleSort }) => {
  const displayTag = (type, group, tag) =>
    tag.type === type && (
      <Chip key={`${group.id}-${tag.id}`} label={tag.name} className={classes.chip} />
    );

  return (
    <Table>
      <EnhancedTableHead
        order={order}
        orderBy={orderBy}
        onRequestSort={handleSort}
        columnData={columnData}
      />
      <TableBody>
        {groups.map(group => (
          <TableRow key={group.id}>
            <TableCell style={{ width: 40 }}>
              {group.isMember ? (
                <IconButton
                  color="primary"
                  className={classes.button}
                  component="span"
                  onClick={() => handleRemove(group.id)}
                >
                  <RemoveCircle />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  className={classes.button}
                  component="span"
                  onClick={() => handleAdd(group.id)}
                >
                  <AddCircle />
                </IconButton>
              )}
            </TableCell>
            <TableCell>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                  width: '200px',
                }}
              >
                <Link to={`/groups/${group.id}`}>{group.name}</Link>
              </span>
            </TableCell>
            <TableCell>
              {group.tags.map(tag => displayTag(TAG_TYPE_ORG_STRUCTURE, group, tag))}
            </TableCell>
            <TableCell>
              <div>{group.tags.map(tag => displayTag(TAG_TYPE_CAPABILITY, group, tag))}</div>
            </TableCell>
            <TableCell>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                }}
              >
                {moment.unix(group.updatedAt).format('LLL')}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

GroupTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
};

export default withStyles(styles)(GroupTable);
