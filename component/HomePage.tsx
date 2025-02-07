"use client";
import Image from "next/image";
import React from "react";
import picture from "@/public/combined_stylized.jpg";
import { Button } from "antd";
import { redirect } from "next/navigation";
function Homepage() {
  return (
    <div className="w-[90%] mx-auto h-screen mt-10 bg-gray 3xl:w-[70%] 3xl:flex gap-20">
      <div className=" 3xl:mt-[300px] 3xl:w-[60%]">
        <p className="text-4xl font-bold">
          Can not find <span className="text-[#0866FF]">Call Logs</span> ? View Them Here
        </p>
        <p className="mt-4">
          Gain comprehensive insights into your communication patterns with detailed call logs and
          statistics. Effortlessly monitor call durations, track missed calls, and analyze overall
          communication activity to optimize efficiency and stay connected.
        </p>
        <div className="mt-4 gap-4  flex flex-col sm:flex-row sm:gap-5 ">
          <Button
            className="shadow-sm"
            type="primary"
            size="large"
            onClick={() => {
              redirect("/calllog");
            }}
          >
            GET STARTED
          </Button>
          <Button
            className="shadow-sm"
            type="dashed"
            size="large"
            onClick={() => {
              redirect("/guide");
            }}
          >
            Guide how to find JSON file
          </Button>
        </div>
      </div>
      <div className="mt-5 ">
        <Image src={picture} alt="" className="shadow-lg " />
      </div>
    </div>
  );
}

export default Homepage;
