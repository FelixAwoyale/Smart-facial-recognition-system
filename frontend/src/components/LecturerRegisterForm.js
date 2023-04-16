import React, { useState } from "react";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";
// import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function RegisterForm() {
  const { LecturerRegister } = useAuth();
  const [formValues, setformValues] = useState({
    lastname: "",
    firstname: "",
    email: "",
    matricno: "",
    level: "",
    password: "",
  });

  // const Register = async (
  //   firstname,
  //   lastname,
  //   email,
  //   password,
  //   matricno,
  //   level
  // ) => {
  //   const response = axios.post(`http://127.0.0.1:5000/student/register`, {
  //     firstname,
  //     lastname,
  //     matricno,
  //     email,
  //     password,
  //     level,
  //   });

  //   return response;
  // };

  const handleUpdates = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };

  console.log(formValues);

  const handleRegister = async () => {
    try {
      await LecturerRegister(
        formValues.firstname,
        formValues.lastname,
        formValues.email,
        formValues.password
      );
      alert("success");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  return (
    <div>
      <Stack direction="column" spacing={4} sx={{ alignItems: "center" }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography>First Name</Typography>
            <TextField
              placeholder="First Name"
              defaultValue={formValues.firstname}
              onChange={handleUpdates}
              fullWidth
              name="firstname"
            />
          </Box>
          <Box>
            <Typography>Last Name</Typography>
            <TextField
              placeholder="Last Name"
              defaultValue={formValues.lastname}
              onChange={handleUpdates}
              fullWidth
              name="lastname"
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography>Email</Typography>
            <TextField
              placeholder="Email"
              type="email"
              defaultValue={formValues.email}
              onChange={handleUpdates}
              fullWidth
              name="email"
            />
          </Box>
          <Box>
            <Typography>Password</Typography>
            <TextField
              placeholder="Password"
              defaultValue={formValues.password}
              onChange={handleUpdates}
              type="password"
              fullWidth
              name="password"
            />
          </Box>
        </Stack>

        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </Stack>
    </div>
  );
}
