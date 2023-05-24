import {
  Typography,
  Button,
  Box,
  Alert,
  Grid,
  Container,
  Card,
  Stack,
  Modal,
} from "@mui/material";
import React, { useState, useRef } from "react";
import axios from "axios";

import StatsStudents from "../components/StatsStudents";
import StudentProfile from "../components/StudentProfile";
import { Icon } from "@iconify-icon/react";
import { useAuth } from "../context/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

export default function HomeDashboard() {
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const [Error, setError] = useState("");
  const [initialize, setInitialize] = useState();
  const { UserState } = useAuth();
  const [open, setOpen] = useState(false);
  const [popUp, setPopup] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  // const Token = localStorage.getItem("accesstoken");

  // const jwt = require("jsonwebtoken");

  // const decodedToken = jwt.decode(authState.token);

  const startCapture = async () => {
    await setInitialize(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(stream);
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error starting video capture: ", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    startCapture();
  };

  const stopCapture = () => {
    setInitialize(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };
  const handlepopUpclose = () => {
    setPopup(false);
    stopCapture();
  };

  const captureImage = async () => {
    const userId = localStorage.getItem("user");

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const response = await axios.patch(
        `http://127.0.0.1:5000/student/create_encodings/${userId}`,
        { dataUrl }
      );
      if (response.status === 200) {
        setPopup(true);
      }
      // const encodings = await response.json();
      // console.log(encodings);
      setError("");
      return response;
    } catch (err) {
      setError(err.response.data.message);
      console.error("Error capturing image: ", err.response.data.message);
    }
  };

  return (
    <div style={{ marginTop: "7em" }}>
      <Container>
        <Typography variant="h3" sx={{ marginBottom: "2em" }}>
          Welcome, {UserState.name}
        </Typography>
        <Box sx={{ marginBottom: "4em" }}>
          <Grid container>
            <Grid item md={8}>
              <Card
                sx={{
                  padding: "3%",
                  marginRight: "2%",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  border: "2px solid #6BBD74",
                }}
              >
                {" "}
                <StatsStudents />
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card
                sx={{
                  padding: "3%",
                  marginRight: "2%",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  border: "2px solid #6BBD74",
                }}
              >
                <StudentProfile />
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Box>
            <Typography variant="h6">Image Capturing</Typography>
            <Box>
              <Typography>
                Save your encodings for attendance taking purposes
              </Typography>
            </Box>

            <Box>
              <Grid container>
                <Grid item md={6}>
                  <Box sx={{ mt: "15%", mb: "5%" }}>
                    <Stack direction={"row"} spacing={3}>
                      <Button
                        onClick={handleOpen}
                        variant="contained"
                        color="secondary"
                        sx={{ color: "white" }}
                      >
                        Start Capture
                      </Button>
                      <Button
                        onClick={stopCapture}
                        variant="outlined"
                        color="secondary"
                      >
                        Stop Capture
                      </Button>
                    </Stack>
                  </Box>
                  <Button onClick={captureImage} variant="contained">
                    Capture Image
                  </Button>
                </Grid>
                <Grid item md={6}>
                  {Error === "" ? (
                    <>
                      <div />
                    </>
                  ) : (
                    <Alert severity="error">{Error}</Alert>
                  )}
                  {initialize ? (
                    <>
                      <Box sx={{ borderRadius: "15%" }}>
                        <video
                          ref={videoRef}
                          autoPlay
                          style={{ borderRadius: "50%", width: "100%" }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Icon icon="ic:baseline-linked-camera" width="20em" />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              {/* <Box icon="et:caution" /> */}
              <Box sx={{ color: "#6BBD74", marginBottom: "5%" }}>
                <Icon icon="et:caution" width="10em" />
                <Box sx={{ textAlign: "center", textTransform: "uppercase" }}>
                  <Typography variant="h6">note</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "center", mb: "6%" }}>
                <Typography>
                  {" "}
                  Please, Make sure you're using a device with high qaulity
                  camera and also stay in an environment with good lightning
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                sx={{ color: "white" }}
                onClick={handleClose}
              >
                I Understand
              </Button>
            </Box>
          </Modal>
          <Modal open={popUp} onClose={handlepopUpclose}>
            <Box sx={style}>
              <Box sx={{ color: "#6BBD74", marginBottom: "5%" }}>
                <Icon icon="clarity:success-standard-line" width="10em" />
                <Box sx={{ textAlign: "center", textTransform: "uppercase" }}>
                  <Typography variant="h6">Success</Typography>
                </Box>
              </Box>
              <Button variant="contained" onClick={handlepopUpclose}>
                Done
              </Button>
            </Box>
          </Modal>
          {/* <TextField type="file" /> */}
          {/* <video ref={videoRef} autoPlay />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Button onClick={startCapture}>Capture Image</Button>
        <Button onClick={stopCamera}> Stop</Button> */}
        </Box>
      </Container>
    </div>
  );
}
