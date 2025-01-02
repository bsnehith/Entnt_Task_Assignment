import {
  Grid,
  Typography,
  Stack,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function ResponsiveFooter() {
  return (
    <>
      <Divider />
      <footer>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <Stack direction="column" margin={5} spacing={1}>
              <Typography sx={{ textDecoration: "underline", my: 1 }}>
                {" "}
                Need Help Contact us ?
              </Typography>
              <div style={{ display: "flex" }}>
                <MailIcon />
                <a
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "black",
                  }}
                  href="https://www.gmail.com/"
                >
                  - saisnehit19@gmail.com
                </a>
              </div>
              <div style={{ display: "flex" }}>
                <CallIcon />
                <Typography>- 9392693859</Typography>
              </div>
              <div style={{ display: "flex" }}>
                <LinkedInIcon />
                <a
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "black",
                  }}
                  href="https://www.linkedin.com/in/snehith-baratam/"
                >
                  - LinkedIn Profile
                </a>
              </div>
              <div style={{ display: "flex" }}>
                <GitHubIcon />
                <a
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "black",
                  }}
                  href="https://github.com/bsnehith"
                >
                  - Github Profile
                </a>
              </div>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={4}
            xl={4}
            display={"inline-block"}
            alignContent={"center"}
          >
            <Stack direction="column" margin={5}>
              <Typography sx={{ textDecoration: "underline" }}>
                Any queries, please reach out to us.
              </Typography>
              <TextField placeholder="Name" margin="dense" />
              <TextField placeholder="Email" margin="dense" />
              <TextField placeholder="Message" margin="dense" />{" "}
              <Button
                variant="contained"
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                sx={{ width: "25%", mt: 1, ml: 20 }}
              >
                Send
              </Button>
            </Stack>{" "}
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        <Typography align="center" variant="body2">
          Developed by Snehith B &copy; 2024- {new Date().getFullYear()} All
          rights reserved.
        </Typography>

        <Divider sx={{ my: 1 }} />
      </footer>
    </>
  );
}
