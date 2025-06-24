"use client";

import { ClipLoader } from "react-spinners";

const MonoLoader = ({
  size = 40,
  color = "#333",
  loading = true,
}) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <ClipLoader loading={loading} size={size} color={color} />
    </div>
  );
};

export default MonoLoader;
