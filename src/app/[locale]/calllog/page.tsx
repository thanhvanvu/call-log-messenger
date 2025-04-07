import CallLog from "@/component/CallLog/Calllog";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Call Logs and Statistics - Analyze Your Call Data",
  description:
    "Upload, analyze, and view detailed call logs and statistics. Get insights into your call data with easy-to-use filters and charts. Manage call logs effectively with our powerful platform.",
};

function page() {
  return <CallLog />;
}

export default page;
