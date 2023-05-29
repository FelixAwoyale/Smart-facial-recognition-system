import React from "react";
// import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/UserContext";
import { DataGrid } from "@mui/x-data-grid";

export default function AttendanceTable() {
  const { AttendanceRec } = useApp();
  const columns = [
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "matricno", headerName: "Matric", flex: 1 },
    { field: "present", headerName: "Attendance Status", flex: 1 },

    { field: "session", headerName: "Session", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
  ];
  return (
    <div>
      <div>
        {AttendanceRec && <DataGrid rows={AttendanceRec} columns={columns} />}
      </div>
    </div>
  );
}
