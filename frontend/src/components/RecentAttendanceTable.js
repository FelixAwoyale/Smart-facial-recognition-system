import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useApp } from "../context/UserContext";

export default function RecentAttendanceTable() {
  const [Attendance, setAttendance] = useState({});
  const { setAttendanceParams } = useApp();
  useEffect(() => {
    const fetchAttendancebyLecturer = async () => {
      const LecturerIdLocal = localStorage.getItem("lecturerId");
      const response = await axios.get(
        `http://127.0.0.1:5000/attendance/${LecturerIdLocal}`
      );
      setAttendance(response.data.attendance);
    };
    fetchAttendancebyLecturer();
  }, []);

  // console.log(Attendance);
  const columns = [
    { field: "session", headerName: "Session", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "viewAll",
      headerName: "View All",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() =>
            handleViewAllClick(params.row.session, params.row.date)
          }
        >
          View Details
        </Button>
      ),
    },
  ];
  const rows = [];
  if (Attendance) {
    Object.keys(Attendance).forEach((session) => {
      Object.keys(Attendance[session]).forEach((date) => {
        rows.push({
          id: rows.length + 1,
          session,
          date,
        });
      });
    });
  }

  const handleViewAllClick = (session, date) => {
    setAttendanceParams((prev) => ({ ...prev, session: session, date: date }));
  };
  return <div>{Attendance && <DataGrid rows={rows} columns={columns} />}</div>;
}
