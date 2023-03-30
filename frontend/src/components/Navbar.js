import { Typography, Container, styled, Box, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import React from "react";

const NavLinkStyle = ({ isActive }) => {
  return {
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
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
  return (
    <div className="navbar">
      <Container>
        <NavBar>
          <div>
            <Typography>Attendance system</Typography>
          </div>
          <Stack direction="row" spacing={3}>
            <NavLink to="/" style={NavLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/login" style={NavLinkStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={NavLinkStyle}>
              Register
            </NavLink>
            <NavLink to="/register" style={NavLinkStyle}>
              About
            </NavLink>
          </Stack>
        </NavBar>
      </Container>
    </div>
  );
}
