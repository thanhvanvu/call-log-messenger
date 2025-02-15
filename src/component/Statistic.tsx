import { useCurrentApp } from "@/context/app.context";
import { convertTimeToWholeHour } from "@/utils/helper";
import { Card } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
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

function Statistic() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const { dataStatistic, participants } = useCurrentApp();
  const [dataHourCallChart, setDataHourCallChart] = useState<any>({
    options: {
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
          data: [totalHourFromNameA, totalSuccessCallFromNameA, totalMissedCallFromNameA],
          backgroundColor: "rgba(24, 74, 182, 0.5)",
        },
        {
          label: participants?.nameB,
          data: [totalHourFromNameB, totalSuccessCallFromNameB, totalMissedCallFromNameB],
          backgroundColor: "rgba(226, 18, 167, 0.5)",
        },
      ],
    };

    setDataHourCallChart({ ...dataHourCallChart, data: dataChartHour });
  }, [dataStatistic]);
  return (
    <>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 3xl:grid-cols-3">
        <Card title={t("call-logs.success")} hoverable={true} className="">
          <div className="flex flex-col gap-y-3">
            <p>
              {dataStatistic?.totalSuccessCall?.total ? dataStatistic.totalSuccessCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em]">
              {dataStatistic?.totalSuccessCall?.totalDuration
                ? dataStatistic.totalSuccessCall.totalDuration
                : 0}
            </p>
          </div>
        </Card>
        <Card
          title={t("call-logs.success-from-A", { nameA: participants?.nameA })}
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p>
              {dataStatistic?.totalCallFromNameA?.total
                ? dataStatistic.totalCallFromNameA.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em]">
              {dataStatistic?.totalCallFromNameA?.totalDuration
                ? dataStatistic.totalCallFromNameA.totalDuration
                : 0}
            </p>
          </div>
        </Card>
        <Card
          title={t("call-logs.success-from-B", { nameB: participants?.nameB })}
          hoverable={true}
          className=""
        >
          <div className="flex flex-col gap-y-3">
            <p>
              {dataStatistic?.totalCallFromNameB?.total
                ? dataStatistic.totalCallFromNameB.total
                : 0}{" "}
              {t("call-logs.time")}
            </p>
            <p className="tracking-[.1em]">
              {dataStatistic?.totalCallFromNameB?.totalDuration
                ? dataStatistic.totalCallFromNameB.totalDuration
                : 0}
            </p>
          </div>
        </Card>
        <Card title={t("call-logs.missed")} hoverable={true} className="">
          <div className="flex flex-col gap-y-3">
            <p>
              {dataStatistic?.totalMissedCall?.total ? dataStatistic.totalMissedCall.total : 0}{" "}
              {t("call-logs.time")}
            </p>
          </div>
        </Card>
        <Card
          title={t("call-logs.missed-from-A", { nameA: participants?.nameA })}
          hoverable={true}
          className=""
        >
          <p>
            {dataStatistic?.totalMissedCall?.fromNameA
              ? dataStatistic.totalMissedCall.fromNameA
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>
        <Card
          title={t("call-logs.missed-from-B", { nameB: participants?.nameB })}
          hoverable={true}
          className=""
        >
          <p>
            {dataStatistic?.totalMissedCall?.fromNameB
              ? dataStatistic.totalMissedCall.fromNameB
              : 0}{" "}
            {t("call-logs.time")}
          </p>
        </Card>
      </div>
      <div className="flex flex-col gap-y-6 justify-evenly w-auto mt-5 lg:flex-row ">
        <div className="w-[100%] 2xl:w-[60%]">
          <Bar options={dataHourCallChart?.options} data={dataHourCallChart?.data} />
        </div>
      </div>
    </>
  );
}

export default Statistic;
