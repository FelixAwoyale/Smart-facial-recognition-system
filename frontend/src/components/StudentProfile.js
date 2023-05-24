import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function StudentProfile() {
  const { UserState } = useAuth();
  // console.log(UserState);
  return (
    <div>
      <Box className="studentprofile">
        <Avatar className="mb-profile" />
        <Typography variant="h6" className="mb-profile">
          {UserState.name}
        </Typography>
        <Box className="mb-profile" sx={{ marginTop: "1em" }}>
          <Typography>Matric No: {UserState.matricno}</Typography>
          <Typography>Level: {UserState.level}</Typography>
        </Box>
      </Box>
    </div>
  );
}
