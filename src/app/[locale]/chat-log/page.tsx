import ChatLog from "@/component/ChatLog/ChatLog";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upload & Reorder Facebook Messenger Call Logs – PDF Export Tool",
  description:
    "Easily upload, preview, reorder, and export Facebook Messenger call log screenshots. Drag-and-drop support, multilingual UI, and customizable PDF settings.",
};

const page = () => {
  return <ChatLog />;
};

export default page;
