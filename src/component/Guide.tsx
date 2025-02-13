import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

function Guide() {
  const t = useTranslations();

  const steps = [
    {
      text: t("json-guide.step1"),
      image: "/guide/1.jpg",
    },
    {
      text: t("json-guide.step2"),
      image: "/guide/2.jpg",
    },
    {
      text: t("json-guide.step3"),
      image: "/guide/3.jpg",
    },
    {
      text: t("json-guide.step4"),
      image: "/guide/4.jpg",
    },
    {
      text: t("json-guide.step5"),
      image: "/guide/5.jpg",
    },
    {
      text: t("json-guide.step6"),
      image: "/guide/6.jpg",
    },
    {
      text: t("json-guide.step7"),
      image: "/guide/7.jpg",
    },
    {
      text: t("json-guide.step8"),
      image: "/guide/8.jpg",
    },
    {
      text: t("json-guide.step9"),
      image: "/guide/9.jpg",
    },
    {
      text: t("json-guide.step10"),
      image: "/guide/10.jpg",
    },
    {
      text: t("json-guide.step11"),
      image: "/guide/11.jpg",
    },
    {
      text: t("json-guide.step12"),
      image: "/guide/12.jpg",
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
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Facebook Message Download Guide
      </h1>
      {steps.map((step, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-none">
          <p className="font-medium text-lg">
            {index + 1}. {step.text}
          </p>
          {step.list && (
            <ul className="list-disc list-inside ml-4 text-gray-700 mt-2">
              {step.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          <Image
            src={step.image}
            alt={`Step ${index + 1}`}
            className="mx-auto mt-3 rounded-lg shadow"
            width={500}
            height={300}
          />
        </div>
      ))}
    </div>
  );
}

export default Guide;
