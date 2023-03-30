import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
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
          <Typography variant="h4">Get Started</Typography>
          <Box sx={{ mt: "10%", width: "50%" }}>
            <RegisterForm />
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: "5%" }}
          >
            <Box>
              <Button>Register as a Lecturer</Button>
            </Box>

            <Box>
              <Button variant="h6">Register as an Admin</Button>
            </Box>
            <Box>
              <Button variant="h6">Log In</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
