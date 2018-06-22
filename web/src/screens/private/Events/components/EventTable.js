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
  { id: 'groupName', numeric: false, disablePadding: false, label: 'Group', enabled: true },
  { id: 'detail', numeric: false, disablePadding: false, label: 'Detail', enabled: false },
];

const EventTable = ({ classes, events, order, orderBy, onSort }) => (
  <Table className={classes.table}>
    <EnhancedTableHead
      order={order}
      orderBy={orderBy}
      onRequestSort={onSort}
      columnData={columnData}
    />
    <TableBody>
      {events.map(event => (
        <TableRow key={event.id}>
          <TableCell className={classes.tableCell}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/groups/${event.group.id}`}>{event.group.name}</Link>
          </TableCell>
          <TableCell>{event.details}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

EventTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default withStyles(styles)(EventTable);
