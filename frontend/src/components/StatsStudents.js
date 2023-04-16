import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export default function StatsStudents() {
  return (
    <div>
      <Grid container>
        <Grid item md={3}>
          <Box>
            <Typography variant="h5">19</Typography>
            <Typography>Classes Held</Typography>
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box>
            <Typography variant="h5">20</Typography>
            <Typography>Classes Attended</Typography>
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box>
            <Typography variant="h5">4</Typography>
            <Typography>Classes Missed</Typography>
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box>
            <Typography variant="h5">4</Typography>
            <Typography>Attendance missed</Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
