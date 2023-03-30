import React from "react";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";

export default function RegisterForm() {
  return (
    <div>
      <Stack direction="column" spacing={4} sx={{ alignItems: "center" }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography>First Name</Typography>
            <TextField placeholder="First Name" fullWidth />
          </Box>
          <Box>
            <Typography>Last Name</Typography>
            <TextField placeholder="Last Name" fullWidth />
          </Box>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography>Email</Typography>
            <TextField placeholder="Email" type="email" fullWidth />
          </Box>
          <Box>
            <Typography>Matric No</Typography>
            <TextField placeholder="Matric No" fullWidth />
          </Box>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography>Level</Typography>
            <TextField placeholder="Level" type="number" fullWidth />
          </Box>
          <Box>
            <Typography>Password</Typography>
            <TextField placeholder="Password" type="password" fullWidth />
          </Box>
        </Stack>

        <Button variant="contained">Register</Button>
      </Stack>
    </div>
  );
}
