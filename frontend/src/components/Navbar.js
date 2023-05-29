import {
  Typography,
  Container,
  styled,
  Box,
  Stack,
  Button,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

const NavLinkStyle = ({ isActive }) => {
  return {
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    color: isActive ? "black" : "green",
  };
};

const NavBar = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "1em",
  marginBottom: "1em",
  textTransform: "uppercase",
});

export default function Navbar() {
  const { LogoutUser } = useAuth;
  // const student = localStorage.getItem("user");
  const access = localStorage.getItem("accesstoken");
  const accType = localStorage.getItem("acc");
  const navigate = useNavigate();

  const HandleLogout = () => {
    LogoutUser?.();
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <div className="navbar">
      <Container>
        <NavBar>
          <div>
            <Typography>Attendance system</Typography>
          </div>
          <Stack direction="row" spacing={3}>
            <NavLink to="/" style={NavLinkStyle}>
              <Typography
                variant="p"
                className="mysubtext"
                sx={{ fontSize: "0.9em" }}
              >
                Home
              </Typography>
            </NavLink>
            <NavLink to="/auth/register" style={NavLinkStyle}>
              <Typography
                variant="p"
                className="mysubtext"
                sx={{ fontSize: "0.9em" }}
              >
                About
              </Typography>
            </NavLink>
            {access ? (
              <>
                {accType === "student" ? (
                  <NavLink to="/student/dashboard" style={NavLinkStyle}>
                    <Typography
                      variant="p"
                      className="mysubtext"
                      sx={{ fontSize: "0.9em" }}
                    >
                      dashboard
                    </Typography>
                  </NavLink>
                ) : (
                  <NavLink to="/lecturer/dashboard" style={NavLinkStyle}>
                    <Typography
                      variant="p"
                      className="mysubtext"
                      sx={{ fontSize: "0.9em" }}
                    >
                      dashboard
                    </Typography>
                  </NavLink>
                )}

                <Button variant="outlined" onClick={HandleLogout}>
                  <Typography
                    variant="p"
                    className="mysubtext"
                    sx={{ fontSize: "0.9em" }}
                  >
                    Log Out
                  </Typography>
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/auth/login" style={NavLinkStyle}>
                  <Typography
                    variant="p"
                    className="mysubtext"
                    sx={{ fontSize: "0.9em" }}
                  >
                    Login
                  </Typography>
                </NavLink>
                <NavLink to="/auth/register" style={NavLinkStyle}>
                  <Typography
                    variant="p"
                    className="mysubtext"
                    sx={{ fontSize: "0.9em" }}
                  >
                    Register
                  </Typography>
                </NavLink>
              </>
            )}
          </Stack>
        </NavBar>
      </Container>
    </div>
  );
}
