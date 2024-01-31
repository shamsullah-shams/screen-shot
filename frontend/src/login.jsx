import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomAlert from "./components/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import Paper from "./components/Paper";
import axios from "axios";

const defaultTheme = createTheme();

export default function SignUp() {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertType, setAlertType] = useState();
  const [formIsValid, setFormIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  function handleClick() {
    setLoading(!loading);
  }

  const closeAlertHandler = () => {
    setShowAlert(!showAlert);
  };

  const [user, setUser] = useState({
    url: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // start loading
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/generate-pdf");
      console.log(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error?.response?.data?.message || error.message || "No Server Response"
      );
      setShowAlert(true);
      return setAlertType("error");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    // form validation
    if (name === "url") {
      const isFormValid =
        value.length >= 3 &&
        value.includes("@") &&
        user.password.match(/\d/) !== null &&
        user.password.match(/[a-zA-Z]/) !== null;
      setFormIsValid(isFormValid);
    } else if (name === "password") {
      const isFormValid =
        value.length >= 3 &&
        user.url.includes("@") &&
        value.match(/\d/) !== null &&
        value.match(/[a-zA-Z]/) !== null &&
        value.length >= 8;
      setFormIsValid(isFormValid);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginTop: "100px" }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper>
              <Typography component="h1" variant="h5">
                login
              </Typography>
              {showAlert && (
                <CustomAlert
                  message={errorMessage}
                  severity={alertType}
                  closeAlertHandler={closeAlertHandler}
                />
              )}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="url"
                      label="url"
                      type="url"
                      id="url"
                      autoComplete="url"
                      value={user.url}
                      onChange={handleInputChange}
                      error={Boolean(user.url && !user.url.includes("@"))}
                      helperText={
                        user.url && !user.url.includes("@")
                          ? "Invalid url address."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="new-password"
                      value={user.password}
                      onChange={handleInputChange}
                      error={Boolean(
                        user.password &&
                          (user.password.match(/\d/) === null ||
                            user.password.match(/[a-zA-Z]/) === null ||
                            user.password.length < 8)
                      )}
                      helperText={
                        user.password &&
                        (user.password.match(/\d/) === null ||
                          user.password.match(/[a-zA-Z]/) === null)
                          ? "Password must contain at least one digit and one letter."
                          : user.password.length !== 0 &&
                            user.password.length < 8
                          ? "Password must be at least 8 characters"
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                {loading ? (
                  <LoadingButton
                    onClick={handleClick}
                    loading={loading}
                    fullWidth
                    variant="contained"
                    disabled
                    style={{ width: "100%" }}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    <span>Fetch Data</span>
                  </LoadingButton>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                )}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/signup" variant="body2">
                      Don't have an account? Sign up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
