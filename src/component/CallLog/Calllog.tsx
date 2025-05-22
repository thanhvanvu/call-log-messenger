"use client";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useRef, useState } from "react";
import { InboxOutlined, LineChartOutlined, TableOutlined } from "@ant-design/icons";
import {
  Collapse,
  CollapseProps,
  FloatButton,
  message,
  Popover,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";

import {
  convertTimeStampToDate,
  convertTimeStampToDateInHour,
  decode,
  readFileAsText,
  validateFileType,
} from "@/utils/helper";
import { useTranslations } from "next-intl";
import { useCurrentApp } from "@/context/app.context";
import Statistic from "./Statistic";

import { Link } from "@/i18n/routing";
import { TbTableShortcut } from "react-icons/tb";
import DataTable from "./DataTable";
import CallLogGuide from "./CallLogGuide";

const CallLog = () => {
  const {
    setParticipants,
    setDateFilter,
    setRawCallLogs,
    setDataPdf,
    participants,
    dateRange,
    guideTour,
    tourStep,
    dateFilter,
  } = useCurrentApp();
  const [messageApi, contextHolder] = message.useMessage();

  const [rawCallLogsNotModify, setRawCallLogsNotModify] = useState<IRawLogType[]>([]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const t = useTranslations();

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".json",

    beforeUpload: (file: UploadFile) => {
      const allowedTypes: string[] = ["application/json"];
      const isAllowedType = validateFileType(file, allowedTypes);
      if (!isAllowedType) {
        messageApi.error(`${file.name} is not supported!`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },

    onChange(info) {
      const newFileList = [...info.fileList];

      // Check if all files are uploaded
      const allDone = newFileList.every((file) => file.status === "done");
      const { status } = info.file;

      if (allDone && status == "done") {
        setIsLoadingTable(true);
        setFileList(newFileList);
        messageApi.success(`${newFileList.length} files uploaded successfully.`);
      } else if (status === "error") {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },

    onRemove(file) {
      setIsLoadingTable(true);
      const fileListFiltered = fileList.filter((item) => item.uid != file.uid);
      setFileList(fileListFiltered);
    },
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: `${t("call-logs.statistic")} ${
        dateRange ? `(${dateRange?.from} - ${dateRange?.to})` : ""
      }`,
      children: <Statistic />,
    },
  ];

  useEffect(() => {
    const processFiles = async () => {
      try {
        const rawCallLogsObject: IRawLogType[] = [];

        // Process each file in the fileList
        for (const fileItem of fileList) {
          const file = fileItem.originFileObj;
          if (file) {
            const fileContent = await readFileAsText(file); // Read file as text
            const jsonData = JSON.parse(fileContent); // Parse JSON data

            const messages = jsonData.messages || [];
            const participants = jsonData.participants || [];
            const nameA = decode(participants[0]?.name || "");
            const nameB = decode(participants[1]?.name || "");

            // Set names for participants
            setParticipants({
              nameA: nameA,
              nameB: nameB,
            });

            // Filter and add call logs with call duration
            for (const item of messages) {
              if (item?.call_duration >= 0) {
                const date = new Date(item.timestamp_ms);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                });
                const formattedDateNumber = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
                rawCallLogsObject.push({
                  ...item,
                  date: formattedDate,
                  dateNumber: formattedDateNumber,
                });
              }
            }
          }
        }

        // Sort call logs by timestamp
        rawCallLogsObject.sort((a: IRawLogType, b: IRawLogType) => a.timestamp_ms - b.timestamp_ms);

        // build date filter object
        const filter: IDateFilterType[] = [];
        rawCallLogsObject.forEach((callLog) => {
          const date = new Date(callLog.timestamp_ms);
          const month = date.toLocaleString("default", { month: "long" });
          const year = date.toLocaleString("default", { year: "numeric" });

          const FilterObject: IDateFilterType = {
            text: `${month}, ${year}`,
            value: `${month}, ${year}`,
            label: `${month}, ${year}`,
          };

          // Check if filter array already contains this object
          const exists = filter.some(
            (f) => f.text === FilterObject.text && f.value === FilterObject.value
          );

          if (!exists) {
            filter.push(FilterObject);
          }
        });

        // remove duplicate object in case user upload the same file
        const uniqueRawCallLogsObject = rawCallLogsObject.filter(
          (o, index, arr) =>
            arr.findIndex((item) => JSON.stringify(item) === JSON.stringify(o)) === index
        );

        // Update date filter
        setDateFilter(filter);

        // Set raw call logs after processing all files
        setRawCallLogs(uniqueRawCallLogsObject);
        setRawCallLogsNotModify(uniqueRawCallLogsObject);
      } catch (error) {
        console.log(error);
        messageApi.error("Failed to process the file. Please ensure it contains valid JSON.");
      }
    };

    // Start processing files
    processFiles();
  }, [fileList]);

  // build array data based on filter
  useEffect(() => {
    const dataPdfModified: IDataPdf[] = [];

    if (dateFilter) {
      dateFilter.forEach((item) => {
        const date = item?.text;
        const splitDate = date.split(",");
        const month = splitDate[0];
        const year = splitDate[1];

        // filter data by date
        const filterRawLogs = rawCallLogsNotModify.filter((item) => {
          return item?.date.includes(month) && item?.date.includes(year);
        });

        let totalCallDuration = 0;
        let totalCallFromNameA = 0;
        let totalCallDurationFromNameA = 0;
        let totalCallFromNameB = 0;
        let totalCallDurationFromNameB = 0;
        let totalMissedCallFromNameA = 0;
        let totalMissedCallFromNameB = 0;

        const modifiedCallLogsPdf = filterRawLogs.map((item: IRawLogType) => {
          const sender = decode(item.sender_name || "");
          const content = decode(item.content || "");

          // calculate total call hour
          totalCallDuration = totalCallDuration + item.call_duration;

          // calculate total missed called from name A
          if (sender === participants?.nameA && item.call_duration === 0) {
            totalMissedCallFromNameA += 1;
          }

          // calculate total called from name A
          if (sender === participants?.nameA && item.call_duration > 0) {
            totalCallFromNameA += 1;
            totalCallDurationFromNameA += item.call_duration;
          }

          // calculate total missed called from name B
          if (sender === participants?.nameB && item.call_duration === 0) {
            totalMissedCallFromNameB += 1;
          }

          // calculate total called from name A
          if (sender === participants?.nameB && item.call_duration > 0) {
            totalCallFromNameB += 1;
            totalCallDurationFromNameB += item.call_duration;
          }

          // convert timestamp to date and hour
          const date = new Date(item.timestamp_ms);

          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
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

        // set dateRange
        let dateRangePdf: IDateRange = {
          from: "",
          to: "",
        };
        if (modifiedCallLogsPdf.length > 0) {
          dateRangePdf.from = modifiedCallLogsPdf[0]?.date;
          dateRangePdf.to = modifiedCallLogsPdf[modifiedCallLogsPdf.length - 1]?.date;
        }

        // convert total call duration
        const totalCallHours = Math.floor(totalCallDuration / 3600);
        const totalCallMinutes = Math.floor((totalCallDuration % 3600) / 60);
        const totalCallSeconds = totalCallDuration % 60;
        const formattedTotalCallDuration = `${totalCallHours
          .toString()
          .padStart(2, "0")}:${totalCallMinutes.toString().padStart(2, "0")}:${totalCallSeconds
          .toString()
          .padStart(2, "0")}`;
        const formattedTotalCallDurationInHour = `${totalCallHours
          .toString()
          .padStart(2, "0")} hours ${totalCallMinutes
          .toString()
          .padStart(2, "0")} minutes ${totalCallSeconds.toString().padStart(2, "0")} seconds`;

        // set data statistic
        let dataStatisticPdf: IDataStatistic = {
          totalSuccessCall: {
            total: 0,
            totalDuration: "",
            totalDurationInHourFormat: "",
          },
          totalCallFromNameA: {
            total: 0,
            totalDuration: "",
            totalDurationInHourFormat: "",
          },
          totalCallFromNameB: {
            total: 0,
            totalDuration: "",
            totalDurationInHourFormat: "",
          },
          totalMissedCall: {
            total: 0,
            fromNameA: 0,
            fromNameB: 0,
          },
        };

        // total success call
        dataStatisticPdf.totalSuccessCall.total = totalCallFromNameA + totalCallFromNameB;
        dataStatisticPdf.totalSuccessCall.totalDuration = formattedTotalCallDuration;
        dataStatisticPdf.totalSuccessCall.totalDurationInHourFormat =
          formattedTotalCallDurationInHour;

        // total call from A
        dataStatisticPdf.totalCallFromNameA.total = totalCallFromNameA;
        dataStatisticPdf.totalCallFromNameA.totalDuration = convertTimeStampToDate(
          totalCallDurationFromNameA
        );
        dataStatisticPdf.totalCallFromNameA.totalDurationInHourFormat =
          convertTimeStampToDateInHour(totalCallDurationFromNameA);

        // total call from B
        dataStatisticPdf.totalCallFromNameB.total = totalCallFromNameB;
        dataStatisticPdf.totalCallFromNameB.totalDuration = convertTimeStampToDate(
          totalCallDurationFromNameB
        );
        dataStatisticPdf.totalCallFromNameB.totalDurationInHourFormat =
          convertTimeStampToDateInHour(totalCallDurationFromNameB);

        // total missed call
        dataStatisticPdf.totalMissedCall.total =
          totalMissedCallFromNameA + totalMissedCallFromNameB;
        dataStatisticPdf.totalMissedCall.fromNameA = totalMissedCallFromNameA;
        dataStatisticPdf.totalMissedCall.fromNameB = totalMissedCallFromNameB;

        dataPdfModified.push({
          monthYear: date,
          dateRange: dateRangePdf,
          callLogToShow: modifiedCallLogsPdf,
          statistic: dataStatisticPdf,
        });
      });
    }
    setDataPdf(dataPdfModified);
  }, [rawCallLogsNotModify]);

  return (
    <>
      {contextHolder}

      <div className="mt-10 w-[90%] m-auto 3xl:w-[80%] pb-14">
        <div className="mt-4">
          <Dragger className="block m-auto mt-20 lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%]" {...props}>
            <div className="" ref={tourStep?.step0}>
              <p className="ant-upload-drag-icon ">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t("call-logs.click-upload")}</p>
              <p className="ant-upload-hint">{t("call-logs.upload-note")}</p>
              <Link
                href="/guide"
                className="ant-upload-hint"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {t("call-logs.guide")}
              </Link>
            </div>
          </Dragger>

          {/* Disclaimer */}
          <div className="lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%] m-auto border rounded-md text-[rgb(183,181,181)] p-3 mt-4 text-xs flex flex-col gap-3 ">
            <p className="font-bold">{t("disclaimer.line1")}</p>
            <p>{t("disclaimer.line2")}</p>
            <p>{t("disclaimer.line3")}</p>
            <p>{t("disclaimer.line4")}</p>
          </div>

          <div className="flex justify-center mt-4 w-[100%]">
            <CallLogGuide />
          </div>
        </div>
        <div className="flex flex-col gap-y-10 mt-5">
          <Collapse items={items} activeKey={tourStep.currentStep >= 2 ? 1 : undefined} />
        </div>

        <DataTable
          isLoadingTable={isLoadingTable}
          setIsLoadingTable={setIsLoadingTable}
          rawCallLogsNotModify={rawCallLogsNotModify}
        />

        {/* <div className="hidden 992:block">
          <FloatButton.Group
            // @ts-ignore
            ref={tourStep?.step6}
            trigger="hover"
            type="primary"
            style={{ insetInlineEnd: 50 }}
            icon={<TbTableShortcut />}
          >
            <Popover
              content={<Statistic forFloatButton={true} />}
              trigger="click"
              placement="left"
              overlayStyle={{ width: "70%" }}
            >
              <FloatButton
                icon={<LineChartOutlined />}
                tooltip={<div>{t("float-button.statistic")}</div>}
              />
            </Popover>

            <Popover
              content={
                <DataTable
                  isLoadingTable={isLoadingTable}
                  setIsLoadingTable={setIsLoadingTable}
                  rawCallLogsNotModify={rawCallLogsNotModify}
                />
              }
              trigger="click"
              placement="left"
              overlayStyle={{ width: "80%" }} // Set the width of the popover content
            >
              <FloatButton
                icon={<TableOutlined />}
                tooltip={<div>{t("float-button.table")}</div>}
              />
            </Popover>
          </FloatButton.Group>
        </div> */}
      </div>
    </>
  );
};

export default CallLog;
