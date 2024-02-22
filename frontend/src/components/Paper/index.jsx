import React from "react";
import "./index.css";
import Paper from "@mui/material/Paper";

const CustomPaper = (props) => (
  <div elevation={3} className="verification-form">
    {props.children}
  </div>
);

export default CustomPaper;
