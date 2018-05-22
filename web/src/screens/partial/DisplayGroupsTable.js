import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';
import Chip from 'material-ui/Chip';

const DisplayRequests = ({ classes, groups, locationFilter, capabilityFilter, searchFilter }) => {
  const displayLocationTags = tag =>
    tag.type === 'orgStructure' && <span key={tag.name}>{tag.name} </span>;

  const displayCapabilityTags = tag =>
    tag.type === 'capability' && <Chip key={tag.name} label={tag.name} className={classes.chip} />;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Group Name</TableCell>
          <TableCell>Location/HQ</TableCell>
          <TableCell>Capabilities</TableCell>
          <TableCell>Date Updated</TableCell>
          <TableCell>Date Created</TableCell>
          <TableCell>Created By</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {groups.map((group) => {
          const hasFilterLocation = _.some(
            group.tags,
            tag => tag.type === 'orgStructure' && tag.name === locationFilter,
          );
          const hasFilterCapability = _.some(
            group.tags,
            tag => tag.type === 'capability' && tag.name === capabilityFilter,
          );
          const hasSearchFilter = group.name.toLowerCase().startsWith(searchFilter.toLowerCase());

          if (
            (hasFilterLocation || locationFilter === '') &&
            (hasFilterCapability || capabilityFilter === '') &&
            (hasSearchFilter || searchFilter === '')
          ) {
            return (
              <TableRow key={group.id}>
                <TableCell>
                  <Link to={`/groups/${group.id}`}>{group.name}</Link>
                </TableCell>
                <TableCell>{group.tags.map(tag => displayLocationTags(tag))}</TableCell>
                <TableCell>
                  <div>{group.tags.map(tag => displayCapabilityTags(tag))}</div>
                </TableCell>
                <TableCell>{moment.unix(group.updatedAt).format('LLL')}</TableCell>
                <TableCell>{moment.unix(group.createdAt).format('LLL')}</TableCell>
              </TableRow>
            );
          }
          return null;
        })}
      </TableBody>
    </Table>
  );
};

DisplayRequests.propTypes = {
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
  locationFilter: PropTypes.string.isRequired,
  capabilityFilter: PropTypes.string.isRequired,
  searchFilter: PropTypes.string.isRequired,
};

export default DisplayRequests;
