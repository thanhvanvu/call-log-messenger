import { useCurrentApp } from "@/context/app.context";
import { convertTimeToWholeHour } from "@/utils/helper";
import { Card } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { HiOutlinePhoneMissedCall, HiPhoneMissedCall } from "react-icons/hi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface IProps {
  forFloatButton?: boolean;
}

function Statistic(props: IProps) {
  const { forFloatButton } = props;
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const { dataStatistic, participants, tourStep, dateRange } = useCurrentApp();
  const [dataHourCallChart, setDataHourCallChart] = useState<any>({
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
      },
    },
    data: {
      labels: [], // Empty labels array
      datasets: [], // Empty datasets array
    },
  });
  const t = useTranslations();

  // build data for chart
  useEffect(() => {
    const statistic = dataStatistic;

    const totalHourFromNameA = convertTimeToWholeHour(statistic?.totalCallFromNameA?.totalDuration);
    const totalHourFromNameB = convertTimeToWholeHour(statistic?.totalCallFromNameB?.totalDuration);

    const totalMissedCallFromNameA = statistic?.totalMissedCall?.fromNameA;
    const totalMissedCallFromNameB = statistic?.totalMissedCall?.fromNameB;

    const totalSuccessCallFromNameA = statistic?.totalCallFromNameA?.total;
    const totalSuccessCallFromNameB = statistic?.totalCallFromNameB?.total;

    const dataChartHour = {
      labels: ["Total Call Hour", "Number Success Call", "Number Missed Call"],
      datasets: [
        {
          label: participants?.nameA,
          data: [totalHourFromNameA, totalSuccessCallFromNameA, totalMissedCallFromNameB],
          backgroundColor: "rgba(24, 74, 182, 0.5)",
        },
        {
          label: participants?.nameB,
          data: [totalHourFromNameB, totalSuccessCallFromNameB, totalMissedCallFromNameA],
          backgroundColor: "rgba(226, 18, 167, 0.5)",
        },
      ],
    };

    setDataHourCallChart({ ...dataHourCallChart, data: dataChartHour });
  }, [dataStatistic]);

  return (
    <>
      {forFloatButton && (
        <p className="text-lg mb-3 font-bold">
          {t("call-logs.statistic")} {dateRange ? `(${dateRange?.from} - ${dateRange?.to})` : ""}
        </p>
      )}

      <div
        className="grid grid-cols-1 gap-5 md:hidden xl:grid xl:grid-cols-3 "
        ref={tourStep.step2}
      >
        <Card
          title={
            <div className="flex items-center gap-2 color-[#28a745] ">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success")}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalSuccessCall?.total ? dataStatistic.totalSuccessCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalSuccessCall?.totalDurationInHourFormat
                ? dataStatistic.totalSuccessCall.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success-from-A", { nameA: participants?.nameA })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalCallFromNameA?.total
                ? dataStatistic.totalCallFromNameA.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalCallFromNameA?.totalDurationInHourFormat
                ? dataStatistic.totalCallFromNameA.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success-from-B", { nameB: participants?.nameB })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalCallFromNameB?.total
                ? dataStatistic.totalCallFromNameB.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalCallFromNameB?.totalDurationInHourFormat
                ? dataStatistic.totalCallFromNameB.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.missed")}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#f44336]">
              {dataStatistic?.totalMissedCall?.total ? dataStatistic.totalMissedCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
          </div>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.A-missed-call", { nameA: participants?.nameA })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <p className="text-[#f44336]">
            {dataStatistic?.totalMissedCall?.fromNameB
              ? dataStatistic.totalMissedCall.fromNameB
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.B-missed-call", { nameB: participants?.nameB })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <p className="text-[#f44336]">
            {dataStatistic?.totalMissedCall?.fromNameA
              ? dataStatistic.totalMissedCall.fromNameA
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>
      </div>

      <div
        className="hidden  md:grid-cols-2 md:grid grid-cols-1 gap-5 xl:hidden "
        ref={tourStep.step2}
      >
        <Card
          title={
            <div className="flex items-center gap-2 color-[#28a745] ">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success")}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalSuccessCall?.total ? dataStatistic.totalSuccessCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalSuccessCall?.totalDurationInHourFormat
                ? dataStatistic.totalSuccessCall.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.missed")}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#f44336]">
              {dataStatistic?.totalMissedCall?.total ? dataStatistic.totalMissedCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success-from-A", { nameA: participants?.nameA })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalCallFromNameA?.total
                ? dataStatistic.totalCallFromNameA.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalCallFromNameA?.totalDurationInHourFormat
                ? dataStatistic.totalCallFromNameA.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.A-missed-call", { nameA: participants?.nameA })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <p className="text-[#f44336]">
            {dataStatistic?.totalMissedCall?.fromNameB
              ? dataStatistic.totalMissedCall.fromNameB
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <IoMdCall className="text-[#28a745]" />
              {t("call-logs.success-from-B", { nameB: participants?.nameB })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-[#28a745]">
              {dataStatistic?.totalCallFromNameB?.total
                ? dataStatistic.totalCallFromNameB.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em] text-[#28a745]">
              {dataStatistic?.totalCallFromNameB?.totalDurationInHourFormat
                ? dataStatistic.totalCallFromNameB.totalDurationInHourFormat
                : 0}
            </p>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <HiPhoneMissedCall className="text-[#f44336]" />
              {t("call-logs.B-missed-call", { nameB: participants?.nameB })}
            </div>
          }
          hoverable={true}
          className=""
        >
          <p className="text-[#f44336]">
            {dataStatistic?.totalMissedCall?.fromNameA
              ? dataStatistic.totalMissedCall.fromNameA
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>
      </div>
      <div className="flex flex-col gap-y-6 justify-evenly w-auto mt-5 lg:flex-row ">
        <div className="w-[100%] h-[300px] xl:h-[500px] 2xl:w-[60%]  " ref={tourStep.step3}>
          <Bar options={dataHourCallChart?.options} data={dataHourCallChart?.data} />
        </div>
      </div>
    </>
  );
}

export default Statistic;
