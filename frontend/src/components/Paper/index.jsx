import React from "react";
import "./index.css";
import Paper from "@mui/material/Paper";

const CustomPaper = (props) => (
  <Paper elevation={3} className="verification-form">
    {props.children}
  </Paper>
);

export default CustomPaper;
