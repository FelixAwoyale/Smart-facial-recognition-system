import { Typography, Container, Box, Button, Grid } from "@mui/material";
import React from "react";
import HeroBg from "../assets/Images/herobg2.png";

function Home() {
  return (
    <div style={{ marginTop: "7em" }}>
      <Container>
        <Grid container>
          <Grid Item md={6}>
            <Box>
              <Typography
                variant="h2"
                sx={{ marginTop: "1em", marginBottom: "1em" }}
              >
                Smart Facial recognition system for attendance
              </Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "1em", marginBottom: "1em" }}
                className="mysubtext"
              >
                Smart facial recognition technology for attendance is a system
                that uses artificial intelligence to recognize and verify an
                individual's identity through their facial features.
              </Typography>
              <Box sx={{ marginTop: "2em", marginBottom: "1em" }}>
                <Button variant="contained">Get Started</Button>
              </Box>
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={HeroBg}
                alt="lecturer teaching"
                style={{ width: "100%" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
