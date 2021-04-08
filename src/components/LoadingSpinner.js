import { before } from "lodash";
import React from "react";
import "../styles/LoadingSpinner.css";

function LoadingSpinner() {
  return <div className="lds-dual-ring"></div>;
}

export default LoadingSpinner;
