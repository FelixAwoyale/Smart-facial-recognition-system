import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [AttendanceParams, setAttendanceParams] = useState({
    session: "",
    date: "",
  });

  const [AttendanceRec, setAttendanceRec] = useState([]);

  useEffect(() => {
    try {
      const fetchAttendanceBySession = async () => {
        const response = await axios.get(
          `http://127.0.0.1:5000/attendance/session/${AttendanceParams.session}/date/${AttendanceParams.date}`
        );

        setAttendanceRec(response.data.attendance);
      };
      fetchAttendanceBySession();
    } catch (error) {
      console.log("error");
    }
  }, [AttendanceParams.date, AttendanceParams.session]);

  const value = {
    AttendanceParams,
    setAttendanceParams,
    AttendanceRec,
    setAttendanceRec,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
