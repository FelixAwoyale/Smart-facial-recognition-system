import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";
// import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LecturerLoginForm() {
  const { LecturerLogin } = useAuth();
  const navigate = useNavigate();
  const [formValues, setformValues] = useState({
    lastname: "",
    firstname: "",
    email: "",
    matricno: "",
    level: "",
    password: "",
  });

  // const Login = async (matricno, password) => {
  //   const response = axios.post(`http://127.0.0.1:5000/student/login`, {
  //     matricno,

  //     password,
  //   });

  //   console.log(response);

  //   localStorage.setItem("accesstoken", response.data);

  //   return response;
  // };

  const handleUpdates = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };

  console.log(formValues);

  const handleLogin = async () => {
    try {
      await LecturerLogin(formValues.email, formValues.password);

      navigate("/lecturer/dashboard");
      alert("success");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  return (
    <div>
      <Stack direction="column" spacing={4}>
        <Box>
          <Typography>Email</Typography>
          <TextField
            placeholder="Email"
            defaultValue={formValues.email}
            name="email"
            fullWidth
            onChange={handleUpdates}
          />
        </Box>
        <Box>
          <Typography>Password</Typography>
          <TextField
            placeholder="password"
            type="password"
            fullWidth
            defaultValue={formValues.password}
            name="password"
            onChange={handleUpdates}
          />
        </Box>
        <Box>
          <Typography>Forgot password ?</Typography>
        </Box>
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </div>
  );
}
