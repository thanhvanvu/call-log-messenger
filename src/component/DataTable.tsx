"use client";
import { Button, Popconfirm, Popover, Table, TablePaginationConfig, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { InboxOutlined, RedoOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useCurrentApp } from "@/context/app.context";
import { convertTimeStampToDate, convertTimeStampToDateInHour, decode } from "@/utils/helper";
import { data } from "@/utils/dataUtils";
import { FilterValue } from "antd/es/table/interface";
import { HiPhoneMissedCall } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import { IoIosColorFill } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "@/i18n/routing";
import PdfExport from "./PdfExport";
import { FaFilePdf } from "react-icons/fa6";
import { BrowserView, MobileView } from "react-device-detect";
import { useReactToPrint } from "react-to-print";

const sample = data;

interface IProps {
  isLoadingTable: boolean;
  setIsLoadingTable: (v: boolean) => void;
  rawCallLogsNotModify: IRawLogType[];
}

function DataTable(props: IProps) {
  const { isLoadingTable, setIsLoadingTable, rawCallLogsNotModify } = props;
  const {
    participants,
    rawCallLogs,
    setRawCallLogs,
    setDataStatistic,
    dateFilter,
    setDateRange,
    tourStep,
  } = useCurrentApp();
  const [dataToShow, setDataToShow] = useState<ICallLogType[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isShowDeleteAction, setIsShowDeleteAction] = useState<boolean>(false);
  const [missedCallBackground, setMissedCallBackground] = useState<boolean>(false);
  const [pdfExport, setPdfExport] = useState<boolean>(false);
  const t = useTranslations();

  // pdf
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Call-logs",
    // onAfterPrint: () => setTriggerPDFExport(false),
  });

  const columns: any = [
    {
      title: <span className="block text-base text-center text-white">{t("call-logs.date")}</span>,
      dataIndex: "date",
      key: "date",
      width: "15%",
      align: "center",
      filteredValue: filteredInfo.date || null,
      filters: dateFilter,
      sortOrder: sortedInfo.columnKey === "date" ? sortedInfo.order : null,
      sorter: (a: ICallLogType, b: ICallLogType) => {
        return a.timestamp_ms - b.timestamp_ms;
      },
    },

    {
      title: <span className=" text-base text-white ">{t("call-logs.sender")}</span>,
      dataIndex: "sender_name",
      key: "sender_name",
      align: "center",
      width: "20%",
      sortOrder: sortedInfo.columnKey === "sender_name" ? sortedInfo.order : null,
      sorter: (a: ICallLogType, b: ICallLogType) => a.sender_name.length - b.sender_name.length,
    },
    {
      title: <span className=" text-base text-white">{t("call-logs.content")}</span>,
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
      title: <span className=" text-base text-white">{t("call-logs.call-end")}</span>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: "15%",
      render: (text: string) => <p className="tracking-wide">{text}</p>,
    },
    {
      title: <span className=" text-base text-white">{t("call-logs.call-duration")}</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "15%",
      align: "center",
      sortOrder: sortedInfo.columnKey === "call_duration" ? sortedInfo.order : null,
      sorter: (a: ICallLogType, b: ICallLogType) => a.call_duration.localeCompare(b.call_duration),
      render: (text: string) => <p className="font-bold  tracking-wide">{text}</p>,
    },

    isShowDeleteAction && {
      title: <span className="text-base text-white">{t("call-logs.action")}</span>,
      key: "action",
      align: "center",
      width: "15%",
      render: (record: ICallLogType) => (
        <Popconfirm
          title={t("call-logs.delete-popConfirm-title")}
          description={t("call-logs.delete-popConfirm-description")}
          onConfirm={() => {
            const filteredCallLogs = rawCallLogs.filter(
              (callLog) => callLog?.timestamp_ms !== record.timestamp_ms
            );
            setRawCallLogs(filteredCallLogs);
          }}
          // onCancel={cancel}
          okText={t("common.yes")}
          cancelText={t("common.no")}
        >
          <Button danger>{t("call-logs.delete")}</Button>
        </Popconfirm>
      ),
    },
  ].filter(Boolean);

  // Clean data when new Raw Data is detected
  // Decode string
  // Calculate statistic
  // Convert timestamps to human hour
  useEffect(() => {
    // recalculate the statistic
    const rawLogs = rawCallLogs;

    let totalCallDuration = 0;
    let totalCallFromNameA = 0;
    let totalCallDurationFromNameA = 0;
    let totalCallFromNameB = 0;
    let totalCallDurationFromNameB = 0;
    let totalMissedCallFromNameA = 0;
    let totalMissedCallFromNameB = 0;

    const modifiedCallLogs = rawLogs.map((item: IRawLogType) => {
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

    if (modifiedCallLogs.length > 0) {
      setDateRange({
        from: modifiedCallLogs[0]?.date,
        to: modifiedCallLogs[modifiedCallLogs.length - 1]?.date,
      });
    } else {
      setDateRange(null);
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

    setDataStatistic({
      totalSuccessCall: {
        total: totalCallFromNameA + totalCallFromNameB,
        totalDuration: formattedTotalCallDuration,
        totalDurationInHourFormat: formattedTotalCallDurationInHour,
      },
      totalCallFromNameA: {
        total: totalCallFromNameA,
        totalDuration: convertTimeStampToDate(totalCallDurationFromNameA),
        totalDurationInHourFormat: convertTimeStampToDateInHour(totalCallDurationFromNameA),
      },
      totalCallFromNameB: {
        total: totalCallFromNameB,
        totalDuration: convertTimeStampToDate(totalCallDurationFromNameB),
        totalDurationInHourFormat: convertTimeStampToDateInHour(totalCallDurationFromNameB),
      },
      totalMissedCall: {
        total: totalMissedCallFromNameA + totalMissedCallFromNameB,
        fromNameA: totalMissedCallFromNameA,
        fromNameB: totalMissedCallFromNameB,
      },
    });

    // save to sessionStorage
    // sessionStorage.setItem("myData", JSON.stringify(modifiedCallLogs));
    // sessionStorage.setItem("name1", nameA);
    // sessionStorage.setItem("name2", nameB);

    setDataToShow(modifiedCallLogs);

    setIsLoadingTable(false);
  }, [rawCallLogs]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);

    console.log(filters);
    if (filters && filters.date) {
      const filterCallLogs: IRawLogType[] = [];

      const dateArray = filters?.date;

      // filter could be an array, so need to use forEach
      // get month, year from the filter from the table
      // filter it from the initial data raw call logs
      dateArray.forEach((item) => {
        const date = item as string;
        const splitDate = date.split(",");
        const month = splitDate[0];
        const year = splitDate[1];

        const filterRawLogs = rawCallLogsNotModify.filter((item) => {
          return item?.date.includes(month) && item?.date.includes(year);
        });

        // push filtered data in empty array
        filterCallLogs.push(...filterRawLogs);
      });

      // after getting filtered data, set state and continue processing
      setRawCallLogs(filterCallLogs);
    } else {
      // if filter is null
      // set raw call logs with initial raw call logs

      const rawCallLogsCopied = [...rawCallLogsNotModify];
      setRawCallLogs(rawCallLogsCopied);
    }
  };

  return (
    <div ref={tourStep.step4}>
      <Table
        loading={isLoadingTable}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 15, 20, 25, 30],
          showSizeChanger: true,
          showTotal: (total, range) => {
            return (
              <p className="hidden md:inline-block ">
                {range[0]} - {range[1]} {t("call-logs.pagination")} {total}
              </p>
            );
          },
        }}
        size="large"
        title={() => (
          <div className="flex items-center justify-between">
            <div className="text-center font-bold text-2xl py-2">
              <p className="hidden xl:block">
                {dataToShow && dataToShow.length > 0 === true
                  ? t("call-logs.data-title", {
                      nameA: participants?.nameA,
                      nameB: participants?.nameB,
                    })
                  : t("call-logs.sample-data-title")}
                <FaFacebookSquare
                  style={{
                    color: "#0866FF",
                    fontSize: 30,
                    display: "inline-block",
                    marginLeft: 10,
                    verticalAlign: "bottom",
                  }}
                />
              </p>
            </div>
            <div className="flex gap-4">
              <Tooltip
                title={
                  dataToShow && dataToShow.length > 0 === true ? t("common.export-pdf.tooltip") : ""
                }
              >
                <Button
                  danger
                  color="danger"
                  disabled={dataToShow && dataToShow.length > 0 === true ? false : true}
                  onClick={() => {
                    reactToPrintFn();
                  }}
                >
                  <FaFilePdf />
                  {t("common.export-pdf.button")}
                </Button>
              </Tooltip>

              {/* <MobileView>
                <Tooltip
                  title={
                    "Not working as expected on mobile browsers. Please use it on a desktop browser."
                  }
                >
                  <Button
                    danger
                    color="danger"
                    onClick={() => console.log("Not working on mobile browsers")}
                  >
                    <FaFilePdf />
                    {t("common.export-pdf.button")}
                  </Button>
                </Tooltip>
              </MobileView> */}

              <div className="" ref={tourStep?.step5}>
                <Popover
                  placement="topRight"
                  title={"Action"}
                  content={
                    <div className="flex flex-col gap-2">
                      <Button
                        type="primary"
                        onClick={() => {
                          setFilteredInfo({});
                          setSortedInfo({});
                          setRawCallLogs(rawCallLogsNotModify);
                        }}
                      >
                        <RedoOutlined />
                        {t("call-logs.reset-filter")}
                      </Button>
                      <Button
                        color="gold"
                        variant="solid"
                        onClick={() => setMissedCallBackground(!missedCallBackground)}
                      >
                        <IoIosColorFill />
                        {missedCallBackground
                          ? t("call-logs.hide-missed-background")
                          : t("call-logs.show-missed-background")}
                      </Button>
                      <Button
                        type="primary"
                        danger
                        onClick={() => setIsShowDeleteAction(!isShowDeleteAction)}
                      >
                        <MdDeleteForever />
                        {isShowDeleteAction
                          ? t("call-logs.hide-delete-action")
                          : t("call-logs.show-delete-action")}
                      </Button>
                    </div>
                  }
                >
                  <Button type="primary">
                    <RedoOutlined />
                    {t("call-logs.reset-filter")}
                  </Button>
                </Popover>
              </div>
            </div>
          </div>
        )}
        columns={columns}
        onChange={handleTableChange}
        dataSource={dataToShow && dataToShow.length > 0 === true ? (dataToShow as any) : sample}
        className="mt-4"
        scroll={{ x: "max-content", y: 55 * 20 }}
        rowClassName={(record: ICallLogType, index) =>
          record.call_duration === "00:00:00" && missedCallBackground
            ? "call-logs-table-row missed-call-row"
            : "call-logs-table-row"
        }
      />

      <div className="hidden">
        <PdfExport contentRef={contentRef} />
      </div>
    </div>
  );
}

export default DataTable;
