"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCurrentApp } from "@/context/app.context";

function Guide() {
  const t = useTranslations();
  const { language } = useCurrentApp();
  const steps = [
    // {
    //   text: t("json-guide.step1"),
    //   image: "https://i.imgur.com/DUGE6Do.jpg",
    // },
    // {
    //   text: t("json-guide.step2"),
    //   image: "https://i.imgur.com/T04tZnN.jpg",
    // },
    // {
    //   text: t("json-guide.step3"),
    //   image: "https://i.imgur.com/gvzzfSF.jpg",
    // },
    // {
    //   text: t("json-guide.step4"),
    //   image: "https://i.imgur.com/tUaWQ4c.jpg",
    // },
    {
      text: t("json-guide.step5"),
      image: "https://i.imgur.com/qMQc7vT.jpg",
    },
    {
      text: t("json-guide.step6"),
      image: "https://i.imgur.com/fnjf8jl.jpg",
    },
    {
      text: t("json-guide.step7"),
      image: "https://i.imgur.com/wN5zK5e.jpg",
    },
    {
      text: t("json-guide.step8"),
      image: "https://i.imgur.com/XDOtZof.jpg",
    },
    {
      text: t("json-guide.step9"),
      image: "https://i.imgur.com/1Em29GA.jpg",
    },
    {
      text: t("json-guide.step10"),
      image: "https://i.imgur.com/RD9fXDI.jpg",
    },
    {
      text: t("json-guide.step11"),
      image: "https://i.imgur.com/rCQCjlV.jpg",
    },
    {
      text: t("json-guide.step12"),
      image: "https://i.imgur.com/mbupw9U.jpg",
      list: [
        "/your_facebook_activity",
        "/messages",
        "/inbox",
        "/messenger name (e.g., kssf_3333222060082022)",
        "/Your JSON file will be here.",
      ],
    },
  ];
  return (
    <div className=" max-w-2xl bg-white mx-auto md:p-5  ">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Facebook Message Download Guide
      </h1>

      <div className="relative w-full aspect-video shadow-md border">
        <iframe
          src={
            language === "vi"
              ? "https://www.youtube.com/embed/XkVhQjZsO1A"
              : "https://www.youtube.com/embed/6LyeqSbzqp8"
          }
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>

      <div className="mt-4 mb-6 border-b pb-4 last:border-none">
        <p className="font-medium text-lg">
          1.{" "}
          {t.rich("json-guide.step0", {
            aTag: (chunk) => (
              <Link
                target="_blank"
                href="https://accountscenter.facebook.com/info_and_permissions/dyi/?entry_point=download_your_information&referrer=yfi_settings&target_id"
                className=" underline inline font-bold"
              >
                <span className="text-blue">{chunk}</span>
              </Link>
            ),
          })}
          .
        </p>
      </div>
      {steps.map((step, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-none">
          <p className="font-medium text-lg">
            {index + 2}. {step.text}
          </p>
          {step.list && (
            <ul className="list-disc list-inside ml-4 text-gray-700 mt-2">
              {step.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {step?.image && (
            <Image
              src={step.image}
              alt={`Step ${index + 1}`}
              className="mx-auto mt-3 rounded-lg shadow"
              width={500}
              height={300}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Guide;
