"use client";
import React, { useEffect, useState } from "react";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useCurrentApp } from "@/context/app.context";
import { Alert, Card, Table } from "antd";
import { IoMdCall } from "react-icons/io";
import { useTranslations } from "next-intl";
import { HiPhoneMissedCall } from "react-icons/hi";
import { FaFacebookSquare } from "react-icons/fa";
import { convertTimeStampToDate, decode } from "@/utils/helper";

interface IProps {
  contentRef: any;
  //   triggerPDFExport: boolean;
  //   setTriggerPDFExport: (v: boolean) => void;
}

const PdfExport = (props: IProps) => {
  const { contentRef } = props;
  const { participants, dateRange, dataStatistic, rawCallLogs } = useCurrentApp();
  //   const contentRef = useRef<HTMLDivElement>(null);
  //   const reactToPrintFn = useReactToPrint({
  //     contentRef,
  //     documentTitle: "Call-logs",
  //     onAfterPrint: () => setTriggerPDFExport(false),
  //   });
  const t = useTranslations();
  const [dataToShow, setDataToShow] = useState<ICallLogType[]>([]);
  const columns: any = [
    {
      title: <span className="block text-base text-center text-white">Date</span>,
      dataIndex: "dateNumber",
      key: "dateNumber",
      width: "5%",
      align: "center",
    },

    {
      title: <span className=" text-base text-white ">Caller Name</span>,
      dataIndex: "sender_name",
      key: "sender_name",
      align: "center",
      width: "16%",
    },
    {
      title: <span className=" text-base text-white">Call Status</span>,
      dataIndex: "content",
      key: "content",
      align: "center",
      width: "20%",
      render: (value: string, record: ICallLogType) => {
        if (record?.call_duration === "00:00:00") {
          return (
            <p>
              <HiPhoneMissedCall className="text-[#f44336] inline-block mr-2" />
              {value}
            </p>
          );
        } else {
          return (
            <p>
              <IoMdCall className="text-[#28a745] inline-block mr-2 " />
              {value}
            </p>
          );
        }
      },
    },
    {
      title: <span className=" text-base text-white">End Time</span>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: "8%",
      render: (text: string) => <p className="tracking-wide">{text}</p>,
    },
    {
      title: <span className=" text-base text-white">Call Duration</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "8%",
      align: "center",
      render: (text: string) => <p className="font-bold  tracking-wide">{text}</p>,
    },
  ];

  // Clean data when new Raw Data is detected
  // Decode string
  // Calculate statistic
  // Convert timestamps to human hour
  useEffect(() => {
    // recalculate the statistic
    const rawLogs = rawCallLogs;

    const modifiedCallLogs = rawLogs.map((item: IRawLogType) => {
      const sender = decode(item.sender_name || "");
      const content = decode(item.content || "");

      // convert timestamp to date and hour
      const date = new Date(item.timestamp_ms);

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const duration = item.call_duration || 0;
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);

      const seconds = duration % 60;
      const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      return {
        ...item,
        sender_name: sender,
        content: content,
        time: formattedTime,
        call_duration: formattedDuration,
      };
    });

    // save to sessionStorage
    // sessionStorage.setItem("myData", JSON.stringify(modifiedCallLogs));
    // sessionStorage.setItem("name1", nameA);
    // sessionStorage.setItem("name2", nameB);
    console.log("pdf", modifiedCallLogs);
    setDataToShow(modifiedCallLogs);
  }, [rawCallLogs]);

  return (
    <>
      <div className="w-[8.5in] mx-auto px-8  bg-white " ref={contentRef}>
        <div>
          <h1 className="text-2xl font-bold text-center ">
            Call logs between <span className="underline">{participants?.nameA}</span> and{" "}
            <span className="underline">{participants?.nameB}</span>
          </h1>
          <p className="text-center text-gray-400 flex align-middle justify-center mt-3">
            On Facebook Messenger{" "}
            <FaFacebookSquare
              style={{
                color: "#0866FF",
                fontSize: 20,
                display: "inline-block",
                marginLeft: 5,
                verticalAlign: "bottom",
              }}
            />
          </p>
          <p className="text-center mt-3 ">
            <span className="font-bold ">Period:</span> {dateRange?.from} - {dateRange?.to}
          </p>

          <div className="mt-[40px]">
            <Alert
              showIcon
              message="Data Integrity Assurance"
              description={
                <p className="text-justify">
                  These call and video logs have never been modified in any way and are presented in
                  their original, unaltered form as recorded in the Facebook Accounts Centre. The
                  data remains exactly as it was retrieved, ensuring complete accuracy and
                  authenticity.;
                </p>
              }
              type="info"
            />
          </div>

          <div className="font-bold mt-[40px] text-xl ml-1">Call log data statistics:</div>
          <div className="grid grid-cols-2 gap-4 mt-[15px] page-break">
            <Card
              title={
                <div className="flex items-center gap-2 color-[#28a745] ">
                  <IoMdCall className="text-[#28a745]" />
                  Total success calls
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <div className="flex flex-col gap-y-3">
                <p className="text-[#28a745]">
                  {dataStatistic?.totalSuccessCall?.total
                    ? dataStatistic.totalSuccessCall.total
                    : 0}{" "}
                  times
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
                  Total missed calls
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <div className="flex flex-col gap-y-3">
                <p className="text-[#f44336]">
                  {dataStatistic?.totalMissedCall?.total ? dataStatistic.totalMissedCall.total : 0}{" "}
                  times
                </p>
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <IoMdCall className="text-[#28a745]" />
                  Total calls from {participants?.nameA}
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <div className="flex flex-col gap-y-3">
                <p className="text-[#28a745]">
                  {dataStatistic?.totalCallFromNameA?.total
                    ? dataStatistic.totalCallFromNameA.total
                    : 0}{" "}
                  times
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
                  {participants?.nameA} missed total of calls
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <p className="text-[#f44336]">
                {dataStatistic?.totalMissedCall?.fromNameB
                  ? dataStatistic.totalMissedCall.fromNameB
                  : 0}{" "}
                times
              </p>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <IoMdCall className="text-[#28a745]" />
                  Total calls from {participants?.nameB}
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <div className="flex flex-col gap-y-3">
                <p className="text-[#28a745]">
                  {dataStatistic?.totalCallFromNameB?.total
                    ? dataStatistic.totalCallFromNameB.total
                    : 0}{" "}
                  times
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
                  {participants?.nameB} missed total of calls
                </div>
              }
              hoverable={true}
              className="shadow-md"
            >
              <p className="text-[#f44336]">
                {dataStatistic?.totalMissedCall?.fromNameA
                  ? dataStatistic.totalMissedCall.fromNameA
                  : 0}{" "}
                times
              </p>
            </Card>
          </div>

          <Table
            pagination={false}
            size="small"
            columns={columns}
            dataSource={dataToShow}
            className="page-break"
            rowClassName={"call-logs-table-row"}
          />
        </div>
      </div>
    </>
  );
};

export default PdfExport;
