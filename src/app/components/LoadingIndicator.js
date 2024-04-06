// project/src/components/LoadingIndicator.js
import React from "react";
import Image from "next/image";
import loadingGif from "../../../public/loading.gif";

const LoadingIndicator = () => (
  <div style={{ width: 25, height: 25, position: "relative" }}>
    <Image src={loadingGif} alt="Loading..." layout="fill" objectFit="contain" />
  </div>
);

export default LoadingIndicator;
