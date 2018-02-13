import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

const ExpenseDashboardPage = () => (
  <div style={{ display: 'flex', margin: 40 }}>
    <Grid container spacing={24} direction="column">
      <Grid container item spacing={0} justify="center">
        <Grid item sm={9} xs={12}>
          <Typography variant="display2">... home page ...</Typography>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default ExpenseDashboardPage;
