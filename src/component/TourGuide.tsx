import { Tour, TourProps } from "antd";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useCurrentApp } from "@/context/app.context";
import { useTranslations } from "next-intl";

const TourGuide = () => {
  const { tourStep, setTourStep, guideTour, setGuideTour } = useCurrentApp();
  const t = useTranslations();
  const step0 = useRef(null);
  const step1 = useRef(null);
  const step2 = useRef(null);
  const step3 = useRef(null);
  const step4 = useRef(null);
  const step5 = useRef(null);
  const step6 = useRef(null);
  const step7 = useRef(null);

  const steps: TourProps["steps"] = [
    {
      title: t("guide-tour.upload.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.upload.description.line1")}</li>
          <li>{t("guide-tour.upload.description.line2")}</li>
          <li>{t("guide-tour.upload.description.line3")}</li>
        </ul>
      ),
      cover: (
        <Image
          src="https://i.imgur.com/1vGBPk9.gif"
          width={400}
          height={400}
          alt="Upload JSON file"
          className="shadow-md"
        />
      ),
      target: () => step0.current,
    },
    {
      title: t("guide-tour.json-guide.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.json-guide.description.line1")}</li>
        </ul>
      ),
      cover: (
        <Image
          src="https://i.imgur.com/g4Ngozm.gif"
          width={400}
          height={400}
          alt="Go to page how to find json file"
          className="shadow-md"
        />
      ),
      target: () => step1.current,
    },
    {
      title: t("guide-tour.call-statistic.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.call-statistic.description.line1")}</li>
          <li>{t("guide-tour.call-statistic.description.line2")}</li>
        </ul>
      ),
      target: () => step2.current,
    },
    {
      title: t("guide-tour.statistic-chart.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.statistic-chart.description.line1")}</li>
          <li>{t("guide-tour.statistic-chart.description.line2")}</li>
        </ul>
      ),
      placement: "top",
      target: () => step3.current,
    },
    {
      title: t("guide-tour.table.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.table.description.line1")}</li>
          <li>{t("guide-tour.table.description.line2")}</li>
        </ul>
      ),
      cover: (
        <Image
          src="https://i.imgur.com/70o0en3.gif"
          width={400}
          height={400}
          alt="data table"
          className="shadow-md"
        />
      ),
      target: () => step4.current,
    },
    {
      title: t("guide-tour.reset-button.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.reset-button.description.line1")}</li>
          <li>{t("guide-tour.reset-button.description.line2")}</li>
        </ul>
      ),
      placement: "left",
      cover: (
        <Image
          src="https://i.imgur.com/N6AgVXu.gif"
          width={400}
          height={400}
          alt="refresh button"
          className="shadow-md"
        />
      ),
      target: () => step5.current,
    },
    // {
    //   title: t("guide-tour.float-button.title"),
    //   description: (
    //     <ul className="list-disc list-inside ml-4">
    //       <li>{t("guide-tour.float-button.description.line1")}</li>
    //     </ul>
    //   ),
    //   placement: "leftTop",
    //   cover: (
    //     <div className="w-[30%] mx-auto ">
    //       <Image
    //         src="https://i.imgur.com/TpQjJqf.gif"
    //         alt="float button"
    //         className="shadow-md"
    //         width={400}
    //         height={400}
    //       />
    //     </div>
    //   ),
    //   target: () => step6.current,
    // },
    {
      title: t("guide-tour.language.title"),
      description: (
        <ul className="list-disc list-inside ml-4">
          <li>{t("guide-tour.language.description.line1")}</li>
          <li>{t("guide-tour.language.description.line2")}</li>
        </ul>
      ),
      cover: (
        <div className="w-[30%] mx-auto ">
          <Image
            src="https://i.imgur.com/828DVUa.gif"
            alt="language picker"
            width={230}
            height={274}
            className="shadow-md"
          />
        </div>
      ),
      target: () => step7.current,
    },
  ];

  useEffect(() => {
    setTourStep({
      ...tourStep,
      step0: step0,
      step1: step1,
      step2: step2,
      step3: step3,
      step4: step4,
      step5: step5,
      // step6: step6,
      step7: step7,
    });
  }, []);

  const handleChangeStepTour = (currentStep: number) => {
    setTourStep({ ...tourStep, currentStep: currentStep });
  };
  return (
    <Tour
      disabledInteraction
      gap={{ offset: 10, radius: 10 }}
      open={guideTour}
      onClose={() => {
        setTourStep({ ...tourStep, currentStep: 0 });
        setGuideTour(false);
      }}
      zIndex={2}
      steps={steps}
      onChange={(current) => handleChangeStepTour(current)}
    />
  );
};

export default TourGuide;
