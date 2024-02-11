import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomAlert from "./components/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Paper from "./components/Paper";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const defaultTheme = createTheme();

export default function SignUp() {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("pdf");
  const [alertType, setAlertType] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  function handleClick() {
    setLoading(!loading);
  }

  const closeAlertHandler = () => {
    setShowAlert(!showAlert);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // start loading
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/generate-pdf",
        JSON.stringify({ url, type }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = tempUrl;
      link.setAttribute(
        "download",
        type === "pdf" ? "downloaded-file.pdf" : "downloaded-file.png"
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(tempUrl);
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
    const { value } = event.target;
    setUrl(value);

    // Regular expression for URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const isUrlValid = urlRegex.test(value);
    setFormIsValid(isUrlValid);
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
                Generate PDF or Image
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
                      value={url}
                      onChange={handleInputChange}
                      error={url && !formIsValid}
                      helperText={
                        url && !formIsValid ? "Invalid url address." : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id="demo-form-control-label-placement">
                        Select Type
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="top"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                      >
                        <FormControlLabel
                          value="pdf"
                          control={<Radio />}
                          label="PDF"
                          labelPlacement="bottom"
                        />
                        <FormControlLabel
                          value="image"
                          control={<Radio />}
                          label="IMAGE"
                          labelPlacement="bottom"
                        />
                      </RadioGroup>
                    </FormControl>
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
                    disabled={!formIsValid}
                  >
                    Generate
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
