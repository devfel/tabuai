// project/src/components/LoadingIndicator.js
import React from "react";
import loadingGif from "../../../public/loading.gif";
const LoadingIndicator = () => (
  <div>
    <img src={loadingGif} alt="Loading..." />
  </div>
);

export default LoadingIndicator;
