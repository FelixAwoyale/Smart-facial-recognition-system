import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

export default function StudentProfile() {
  return (
    <div>
      <Box className="studentprofile">
        <Avatar className="mb-profile" />
        <Typography variant="h6" className="mb-profile">
          Felix Awoyale
        </Typography>
        <Box className="mb-profile" sx={{ marginTop: "1em" }}>
          <Typography>Matric No: 160407011</Typography>
          <Typography>Level: 500</Typography>
        </Box>
      </Box>
    </div>
  );
}
