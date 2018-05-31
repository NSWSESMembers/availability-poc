import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';

import Chip from 'material-ui/Chip';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';

import { TAG_TYPE_CAPABILITY, TAG_TYPE_ORG_STRUCTURE } from '../../../../constants';

import styles from './DisplayGroupsTable.styles';

const DisplayRequests = ({ classes, groups, locationFilter, capabilityFilter, searchFilter }) => {
  const displayTag = (type, group, tag) =>
    tag.type === type && (
      <Chip key={`${group.id}-${tag.id}`} label={tag.name} className={classes.chip} />
    );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Group Name</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Capabilities</TableCell>
          <TableCell>Date Updated</TableCell>
          <TableCell>Date Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {groups.map((group) => {
          const hasFilterLocation = _.some(
            group.tags,
            tag => tag.type === TAG_TYPE_ORG_STRUCTURE && tag.id === parseInt(locationFilter, 10),
          );
          const hasFilterCapability = _.some(
            group.tags,
            tag => tag.type === TAG_TYPE_CAPABILITY && tag.id === capabilityFilter,
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
                  <Link to={`/groups/edit/${group.id}`}>{group.name}</Link>
                </TableCell>
                <TableCell>
                  {group.tags.map(tag => displayTag(TAG_TYPE_ORG_STRUCTURE, group, tag))}
                </TableCell>
                <TableCell>
                  <div>{group.tags.map(tag => displayTag(TAG_TYPE_CAPABILITY, group, tag))}</div>
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

export default withStyles(styles)(DisplayRequests);
