import React from "react";
import "./background.css";
import Login from "../../login";

const Background = () => {
  return (
    <div>
      <div class="context">
        <Login />
      </div>
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default Background;
