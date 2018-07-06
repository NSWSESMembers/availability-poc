import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EnhancedTableHead from '../../../../components/Tables/EnhancedTableHead';

import styles from '../../../../styles/AppStyle';

const columnData = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', enabled: true },
];

const UserTable = ({ classes, users, order, orderBy, onSort }) => (
  <Table className={classes.table}>
    <EnhancedTableHead
      order={order}
      orderBy={orderBy}
      onRequestSort={onSort}
      columnData={columnData}
    />
    <TableBody>
      {users.map(user => (
        <TableRow key={user.id}>
          <TableCell className={classes.tableCell}>
            <Link to={`/users/${user.id}`}>{user.displayName}</Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

UserTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ),
  onSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default withStyles(styles)(UserTable);
