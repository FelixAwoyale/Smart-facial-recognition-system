import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";
// import axios from "axios";
import { useAuth } from "../context/AuthContext";
// import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
// import CircularProgress from "@mui/material/CircularProgress";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "white",

//   boxShadow: 24,
//   p: 4,
//   borderRadius: "20px",
// };

export default function LoginForm() {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const [formValues, setformValues] = useState({
    lastname: "",
    firstname: "",
    email: "",
    matricno: "",
    level: "",
    password: "",
  });
  // const [open, setOpen] = useState(false);
  // const [Loading, setLoading] = useState(false);

  // const Login = async (matricno, password) => {
  //   const response = axios.post(`http://127.0.0.1:5000/student/login`, {
  //     matricno,

  //     password,
  //   });

  //   console.log(response);

  //   localStorage.setItem("accesstoken", response.data);

  //   return response;
  // };
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleUpdates = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };

  console.log(formValues);

  const handleLogin = async () => {
    try {
      await Login(formValues.matricno, formValues.password);

      // setLoading(false);
      // await handleOpen();
      navigate("/student/dashboard");

      // alert("success");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  return (
    <div>
      <Stack direction="column" spacing={4}>
        <Box>
          <Typography>Matric No</Typography>
          <TextField
            placeholder="Matric No"
            defaultValue={formValues.matricno}
            name="matricno"
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
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
      {/* <>
        <Modal open={Loginsuccess}>
          {Loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <Box sx={style}>
                <Typography> Login successful</Typography>
                <CheckCircleRoundedIcon sx={{ color: "#008A84" }} />
              </Box>
            </>
          )}
        </Modal>
      </> */}
    </div>
  );
}
