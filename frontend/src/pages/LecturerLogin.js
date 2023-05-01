import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import LoginForm from "../components/LecturerLoginForm";

export default function LecturerLogin() {
  return (
    <div>
      <Container>
        <Box
          sx={{
            mt: "10%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Welcome, Login to continue</Typography>
          <Box sx={{ mt: "10%", width: "50%" }}>
            <LoginForm />
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: "5%" }}
          >
            <Box>
              <Button>Login as a Student</Button>
            </Box>

            <Box>
              <Button variant="h6">Login as an Admin</Button>
            </Box>
            <Box>
              <Button variant="h6">Create an account</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
