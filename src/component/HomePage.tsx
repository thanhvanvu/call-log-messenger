"use client";
import Image from "next/image";
import React from "react";
import picture from "../../public/combined_stylized.jpg";
import { Button } from "antd";
import Link from "next/link";
function Homepage() {
  return (
    <div className="w-[90%] mx-auto h-screen mt-4 bg-gray 3xl:w-[70%] 3xl:flex gap-20">
      <div className=" 3xl:mt-[150px] 3xl:w-[60%]">
        <p className="text-4xl font-bold 3xl:text-6xl">
          Can not find <span className="text-[#0866FF]">Call Logs</span> ? View Them Here
        </p>
        <p className="mt-4">
          Gain comprehensive insights into your communication patterns with detailed call logs and
          statistics. Effortlessly monitor call durations, track missed calls, and analyze overall
          communication activity to optimize efficiency and stay connected.
        </p>
        <div className="mt-4 gap-4  flex flex-col sm:flex-row sm:gap-5 ">
          <Button className="shadow-sm" type="primary" size="large">
            <Link href={"/calllog"}>GET STARTED</Link>
          </Button>
          <Button className="shadow-sm" type="dashed" size="large">
            <Link href={"/guide"}> Guide how to find JSON file</Link>
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
