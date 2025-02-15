"use client";
import { Button, Popconfirm, Popover, Table, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { InboxOutlined, RedoOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useCurrentApp } from "@/context/app.context";
import { convertTimeStampToDate, decode } from "@/utils/helper";
import { data } from "@/utils/dataUtils";
import { FilterValue } from "antd/es/table/interface";

const sample = data;

interface IProps {
  isLoadingTable: boolean;
  setIsLoadingTable: (v: boolean) => void;
  rawCallLogsNotModify: IRawLogType[];
}

function DataTable(props: IProps) {
  const { isLoadingTable, setIsLoadingTable, rawCallLogsNotModify } = props;
  const { participants, rawCallLogs, setRawCallLogs, setDataStatistic, dateFilter, setDateRange } =
    useCurrentApp();
  const [dataToShow, setDataToShow] = useState<ICallLogType[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isShowDeleteAction, setIsShowDeleteAction] = useState<boolean>(false);
  const t = useTranslations();

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
    },
    {
      title: <span className=" text-base text-white">{t("call-logs.call-end")}</span>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: "15%",
      render: (text: string) => <p className="text-base tracking-wide">{text}</p>,
    },
    {
      title: <span className=" text-base text-white">{t("call-logs.call-duration")}</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "15%",
      align: "center",
      sortOrder: sortedInfo.columnKey === "call_duration" ? sortedInfo.order : null,
      sorter: (a: ICallLogType, b: ICallLogType) => a.call_duration.localeCompare(b.call_duration),
      render: (text: string) => <p className="font-bold text-base tracking-wide">{text}</p>,
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

    setDataStatistic({
      totalSuccessCall: {
        total: totalCallFromNameA + totalCallFromNameB,
        totalDuration: formattedTotalCallDuration,
      },
      totalCallFromNameA: {
        total: totalCallFromNameA,
        totalDuration: convertTimeStampToDate(totalCallDurationFromNameA),
      },
      totalCallFromNameB: {
        total: totalCallFromNameB,
        totalDuration: convertTimeStampToDate(totalCallDurationFromNameB),
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
    <Table
      loading={isLoadingTable}
      pagination={{
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
          <div className="flex text-center items-center font-bold text-2xl py-2 ">
            {dataToShow && dataToShow.length > 0 === true
              ? t("call-logs.data-title", {
                  nameA: participants?.nameA,
                  nameB: participants?.nameB,
                })
              : t("call-logs.sample-data-title")}

            <span>
              <FaFacebookSquare style={{ color: "#0866FF", marginLeft: 12, fontSize: 30 }} />
            </span>
            {/* <ExportAsPdf
                  data={dataToShow}
                  headers={["Date", "Sender", "Content", "Call End Time At", "Call Duration"]}
                  headerStyles={{ fillColor: "red" }}
                  title="Sections List"
                  theme="striped"
                >
                  {(props) => <button {...props}>Export as PDF</button>}
                </ExportAsPdf> */}
          </div>
          <div className="hidden lg:block">
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
                    type="primary"
                    danger
                    onClick={() => setIsShowDeleteAction(!isShowDeleteAction)}
                  >
                    {t("call-logs.delete-action")}
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
      )}
      columns={columns}
      onChange={handleTableChange}
      dataSource={dataToShow && dataToShow.length > 0 === true ? dataToShow : sample}
      className="mt-4"
      scroll={{ x: "max-content", y: 55 * 20 }}
      rowClassName="call-logs-table-row"
    />
  );
}

export default DataTable;
