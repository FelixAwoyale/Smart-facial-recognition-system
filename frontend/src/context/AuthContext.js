import { createContext, useState, useContext } from "react";
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

  const [UserState, setUserState] = useState("");

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
    setUserState(response.data.id);
    localStorage.setItem("user", response.data.id);

    return response;
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
    localStorage.setItem("user", response.data.id);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
