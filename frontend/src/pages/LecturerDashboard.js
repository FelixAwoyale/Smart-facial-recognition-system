import {
  Typography,
  Button,
  Box,
  Grid,
  Container,
  Card,
  Stack,
} from "@mui/material";
import React, { useState } from "react";

import StatsLecturer from "../components/StatsLecturer";
import LecturerProfile from "../components/LecturerProfile";
import TakeAttendance from "../components/TakeAttendanceForm";
import RecentAttendanceTable from "../components/RecentAttendanceTable";
import AttendanceTable from "../components/AttendanceTable";
// import { Icon } from "@iconify-icon/react";

export default function HomeDashboard() {
  const [show, setShow] = useState(false);

  const initiateAttendance = () => {
    setShow(!show);
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
            <Box>
              <Grid container>
                <Grid item md={6}>
                  <Typography variant="h6">Take New Attendance</Typography>
                  <Box>
                    <Typography>Initiate a new attendance process</Typography>
                  </Box>
                  <Box sx={{ mt: "5%", mb: "5%" }}>
                    <Stack direction={"row"} spacing={3}>
                      <Button
                        onClick={initiateAttendance}
                        variant="contained"
                        color="secondary"
                        sx={{ color: "white" }}
                      >
                        {show ? `Cancel` : `Take Attendance`}
                      </Button>
                    </Stack>
                    {show ? <TakeAttendance /> : <div />}
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="h6">Recent Attendance</Typography>

                  <Typography>View recently taken attendance</Typography>
                  <Box>
                    <RecentAttendanceTable />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        <AttendanceTable />
      </Container>
    </div>
  );
}
