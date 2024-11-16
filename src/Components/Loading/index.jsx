import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading({ className, size }) {
  return (
    <div
      className={`fixed inset-0 z-[1400] bg-white bg-opacity-50 flex items-center justify-center ${className}`}
    >
      <CircularProgress size={size || 40} />
    </div>
  );
}
