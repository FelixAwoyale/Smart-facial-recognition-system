import React, { useState } from "react";
import { Box, TextField, Typography, Stack, Button } from "@mui/material";
import axios from "axios";
// import { useAuth } from "../context/AuthContext";

export default function TakeAttenanceForm() {
  //   const { LecturerState } = useAuth();
  const [formValues, setformValues] = useState({
    courseName: "",
  });

  const AttendanceFn = async (lecturer, session) => {
    const response = await axios.post(`http://127.0.0.1:5000/markattendance`, {
      lecturer,
      session,
    });
    return response;
  };

  const handleUpdates = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };

  console.log(formValues);

  const handleAttendance = async () => {
    const lecturerIdlocal = localStorage.getItem("lecturerId");
    try {
      await AttendanceFn(lecturerIdlocal, formValues.courseName);
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
            <Typography>Course Name</Typography>
            <TextField
              placeholder="Course Name"
              defaultValue={formValues.courseName}
              onChange={handleUpdates}
              fullWidth
              name="courseName"
            />
          </Box>
        </Stack>

        <Button variant="contained" onClick={handleAttendance}>
          Take Attendance
        </Button>
      </Stack>
    </div>
  );
}
