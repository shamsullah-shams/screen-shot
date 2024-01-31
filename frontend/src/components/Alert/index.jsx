import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const CustomAlert = ({ message, severity, closeAlertHandler }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert onClose={() => closeAlertHandler()} severity={severity}>
        {message}
      </Alert>
    </Stack>
  );
};

export default CustomAlert;
