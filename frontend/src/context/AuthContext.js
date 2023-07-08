import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isauthenticated: false,
    token: null,
  });

  const [AttendanceID, setAttendanceID] = useState("");

  

  const [UserState, setUserState] = useState({
    name: "",
    email: "",
    encoding: "",
    level: "",
    matricno: "",
  });

  const [LecturerState, setLecturerState] = useState({
    name: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("user");
      const response = await axios.get(
        `http://127.0.0.1:5000/student/get/${userId}`
      );

      setUserState({
        name: response.data.firstname + " " + response.data.lastname,
        email: response.data.email,
        encodings: response.data.encodings,
        level: response.data.level,
        matricno: response.data.matricno,
      });
    };
    fetchUser();

    const fetchLecturer = async () => {
      const LecturerIdLocal = localStorage.getItem("lecturerId");
      const response = await axios.get(
        `http://127.0.0.1:5000/lecturer/get/${LecturerIdLocal}`
      );

      setLecturerState({
        name: response.data.firstname + " " + response.data.lastname,
        email: response.data.email,
        department: response.data.department,
      });
    };
    fetchLecturer();
  }, []);

  const Login = async (matricno, password) => {
    const response = await axios.post(`http://127.0.0.1:5000/student/login`, {
      matricno,

      password,
    });
    localStorage.setItem("acc", "Student");
    localStorage.setItem("accesstoken", response.data.token);
    setAuthState({
      isauthenticated: true,
      token: response.data.token,
    });
    const userId = response.data.id;

    const fetchUser = async () => {
      const response = await axios.get(
        `http://127.0.0.1:5000/student/get/${userId}`
      );

      setUserState({
        name: response.data.firstname + " " + response.data.lastname,
        email: response.data.email,
        encodings: response.data.encodings,
        level: response.data.level,
        matricno: response.data.matricno,
      });
    };
    fetchUser();

    localStorage.setItem("user", response.data.id);
  };

  const LecturerLogin = async (email, password) => {
    const response = await axios.post(`http://127.0.0.1:5000/lecturer/login`, {
      email,
      password,
    });
    localStorage.setItem("acc", "Lecturer");
    localStorage.setItem("accesstoken", response.data.token);
    setAuthState({
      isauthenticated: true,
      token: response.data.token,
    });
    setUserState(response.data.id);
    localStorage.setItem("lecturerId", response.data.id);

    return response;
  };

  const LecturerRegister = async (firstname, lastname, email, password) => {
    const response = await axios.post(
      `http://127.0.0.1:5000/lecturer/register`,
      {
        firstname,
        lastname,
        email,
        password,
      }
    );
    return response;
  };

  const LogoutUser = async () => {
    setAuthState({
      isAuthenticated: false,
      token: null,
    });
    // Remove the token from local storage
    window.localStorage.removeItem("accesstoken");
    window.localStorage.clear();
  };

  const value = {
    authState,
    Login,
    LogoutUser,
    UserState,
    LecturerLogin,
    LecturerRegister,
    LecturerState,
    AttendanceID,
    setAttendanceID,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
