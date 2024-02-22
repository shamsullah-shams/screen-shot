import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  createMuiTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import CustomAlert from "./components/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Paper from "./components/Paper";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { getVisitorIdSync } from "fineprint";

const defaultTheme = createTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
  },
});

export default function SignUp() {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("pdf");
  const [alertType, setAlertType] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [visitorId, setVisitorId] = useState("");

  function handleClick() {
    setLoading(!loading);
  }

  const closeAlertHandler = () => {
    setShowAlert(!showAlert);
  };

  useEffect(() => {
    const getId = () => {
      (async () => {
        const visitorId = await getVisitorIdSync();
        setVisitorId(visitorId);
      })();
    };
    getId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // start loading
    setLoading(true);
    try {
      const response = await axios.post(
        "/generate-pdf",
        JSON.stringify({ url, type, visitorId }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      if (response.status === 200) {
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
      } else {
        setLoading(false);
        setErrorMessage(response.data.message || "Something went wrong");
        setShowAlert(true);
        return setAlertType("error");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response.status === 402
          ? "You have tried tree times"
          : "something went wrong"
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
              <h1>Generate PDF or Image</h1>
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
                    <ThemeProvider theme={theme}>
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
                        InputLabelProps={{
                          style: { color: "white", borderColor: "white" }, // Changes label color to white
                        }}
                        InputProps={{
                          style: { color: "white", borderColor: "white" }, // Changes input color and outline color to white
                        }}
                      />
                    </ThemeProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <ThemeProvider theme={theme}>
                        <FormLabel
                          id="demo-form-control-label-placement"
                          style={{ color: "white" }}
                        >
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
                          <ThemeProvider theme={theme}>
                            <FormControlLabel
                              value="pdf"
                              control={<Radio />}
                              label="PDF"
                              labelPlacement="bottom"
                              style={{ color: "white" }}
                            />
                          </ThemeProvider>
                          <ThemeProvider theme={theme}>
                            <FormControlLabel
                              value="image"
                              control={<Radio />}
                              label="IMAGE"
                              labelPlacement="bottom"
                              style={{ color: "white" }}
                            />
                          </ThemeProvider>
                        </RadioGroup>
                      </ThemeProvider>
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
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!formIsValid}
                    style={{ color: "white", borderColor: "white" }}
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
