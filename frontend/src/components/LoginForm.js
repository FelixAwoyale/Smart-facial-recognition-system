import React from "react";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";

export default function LoginForm() {
  return (
    <div>
      <Stack direction="column" spacing={4}>
        <Box>
          <Typography>Matric No</Typography>
          <TextField placeholder="Matric No" fullWidth />
        </Box>
        <Box>
          <Typography>Password</Typography>
          <TextField placeholder="password" type="password" fullWidth />
        </Box>
        <Box>
          <Typography>Forgot password ?</Typography>
        </Box>
        <Button variant="contained">Login</Button>
      </Stack>
    </div>
  );
}
