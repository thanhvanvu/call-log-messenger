"use client";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useRef, useState } from "react";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  InboxOutlined,
  LineChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
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

import { decode, readFileAsText, validateFileType } from "@/utils/helper";
import { useTranslations } from "next-intl";
import { useCurrentApp } from "@/context/app.context";
import Statistic from "./Statistic";
import DataTable from "./DataTable";
import { Link } from "@/i18n/routing";
import { TbTableShortcut } from "react-icons/tb";
import { FcStatistics } from "react-icons/fc";

const CallLog = () => {
  const { setParticipants, setDateFilter, setRawCallLogs, setDateRange, dateRange } =
    useCurrentApp();
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
                rawCallLogsObject.push({ ...item, date: formattedDate });
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

        console.log(uniqueRawCallLogsObject);
      } catch (error) {
        console.log(error);
        messageApi.error("Failed to process the file. Please ensure it contains valid JSON.");
      }
    };

    // Start processing files
    processFiles();
  }, [fileList]);

  return (
    <>
      {contextHolder}
      <div className="mt-10 w-[90%] m-auto 3xl:w-[80%] pb-14">
        <div className="mt-4">
          <Dragger className="block m-auto mt-20 lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%]" {...props}>
            <p className="ant-upload-drag-icon">
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
          </Dragger>
        </div>
        <div className="flex flex-col gap-y-10 mt-5">
          <Collapse items={items} />
        </div>

        <DataTable
          isLoadingTable={isLoadingTable}
          setIsLoadingTable={setIsLoadingTable}
          rawCallLogsNotModify={rawCallLogsNotModify}
        />
      </div>
      <div className="hidden xl:block">
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ insetInlineEnd: 50 }}
          icon={<TbTableShortcut />}
        >
          <Popover
            content={<Statistic />}
            trigger="click"
            placement="leftTop"
            overlayStyle={{ width: "60%" }}
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
            placement="leftTop"
            overlayStyle={{ width: "80%" }} // Set the width of the popover content
          >
            <FloatButton icon={<TableOutlined />} tooltip={<div>{t("float-button.table")}</div>} />
          </Popover>
        </FloatButton.Group>
      </div>
    </>
  );
};

export default CallLog;
