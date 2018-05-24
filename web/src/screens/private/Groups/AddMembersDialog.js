import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// material UI
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import Table, { TableBody, TableCell, TableRow, TableHead } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

// icons
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import ClearIcon from 'material-ui-icons/Clear';

const AddMembersDialog = ({
  classes,
  memberSearchOpen,
  memberSearchText,
  memberSearchResults,
  handleDialogClose,
  handleChange,
  startMemberSearch,
  addMember,
  removeMember,
  membersToBeAdded,
}) => {

  return (
    <Dialog
      open={memberSearchOpen}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Search members</DialogTitle>
      <DialogContent>
        <div>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
              <TextField
                margin="normal"
                id="memberSearchText"
                type="text"
                value={memberSearchText}
                onChange={e => handleChange(e, 'memberSearchText')}
              />
            </Grid>
            <Grid item>
              <div>
                <Button
                  className={classes.button}
                  aria-label="Find members"
                  onClick={startMemberSearch}
                >
                  Search
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
        <div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Add to group</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberSearchResults.map(member => (
                <TableRow key={member.id}>
                  <TableCell>{member.displayName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {_.some(membersToBeAdded, memberToBeAdded => memberToBeAdded.id === member.id) ?
                      (
                        <IconButton
                          className={classes.button}
                          aria-label="Remove member"
                          onClick={() => removeMember(member)}
                        >
                          <ClearIcon />
                        </IconButton>
                      ) :
                      (
                        <IconButton
                          className={classes.button}
                          aria-label="Add member"
                          onClick={() => addMember(member)}
                        >
                          <AddCircleOutline />
                        </IconButton>
                      )
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

AddMembersDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  memberSearchOpen: PropTypes.bool.isRequired,
  memberSearchText: PropTypes.string.isRequired,
  memberSearchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  membersToBeAdded: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  startMemberSearch: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
};

export default AddMembersDialog;
