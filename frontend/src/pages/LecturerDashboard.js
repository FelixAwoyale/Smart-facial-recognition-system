import {
  Typography,
  Button,
  Box,
  Alert,
  Grid,
  Container,
  Card,
  Stack,
} from "@mui/material";
import React, { useState, useRef } from "react";
import axios from "axios";

import StatsLecturer from "../components/StatsLecturer";
import LecturerProfile from "../components/LecturerProfile";
import { Icon } from "@iconify-icon/react";

export default function HomeDashboard() {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [Error, setError] = useState("");
  const [initialize, setInitialize] = useState();

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

  const stopCapture = () => {
    setInitialize(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const AttendanceFn = async (lecturer, session) => {
    const response = await axios.post(`http://127.0.0.1:5000/markattendance`, {
      lecturer,
      session,
    });
    return response;
  };

  const TakeAttendance = async () => {
    AttendanceFn(1, "ssg 211");
  };

  const captureImage = async () => {
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const response = await axios.patch(
        "http://127.0.0.1:5000/student/create_encodings/4",
        { dataUrl }
      );
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
          Welcome, user
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
                <StatsLecturer />
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
                <LecturerProfile />
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
                        onClick={TakeAttendance}
                        variant="contained"
                        color="secondary"
                        sx={{ color: "white" }}
                      >
                        Take attendance
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
          {/* <TextField type="file" /> */}
          {/* <video ref={videoRef} autoPlay />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Button onClick={startCapture}>Capture Image</Button>
        <Button onClick={stopCamera}> Stop</Button> */}
          {Error === "" ? (
            <>
              <div />
            </>
          ) : (
            <Alert severity="error">{Error}</Alert>
          )}
        </Box>
      </Container>
    </div>
  );
}
