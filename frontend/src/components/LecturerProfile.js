import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function StudentProfile() {
  const { LecturerState } = useAuth();
  return (
    <div>
      <Box className="studentprofile">
        <Avatar className="mb-profile" />
        <Typography variant="h6" className="mb-profile">
          {LecturerState.name}
        </Typography>
        <Box className="mb-profile" sx={{ marginTop: "1em" }}>
          <Typography>Email: {LecturerState.email}</Typography>
          <Typography>Department: {LecturerState.department}</Typography>
          {/* <Typography>Level: 500</Typography> */}
        </Box>
      </Box>
    </div>
  );
}
