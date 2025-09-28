"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar height="2px" color="#2196F3" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};

export default NProgressProvider;
