"use client";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  Card,
  Collapse,
  CollapseProps,
  message,
  Table,
  TableColumnsType,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { FaFacebookSquare } from "react-icons/fa";
import {
  convertTimeStampToDate,
  convertTimeToWholeHour,
  data,
  decode,
} from "@/app/utils/dataUltis";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ExportAsPdf } from "react-export-table";
import Link from "next/link";

interface callLogType {
  call_duration: number;
  content: string;
  date: string;
  sender_name: string;
  time: string;
  timestamp_ms: number;
}

const validateFileType = (file: UploadFile, allowedTypes?: string[]) => {
  if (!allowedTypes || !file.type) {
    return true;
  }
  return allowedTypes.includes(file.type);
};

const sample = data;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CallLog = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [rawCallLogs, setRawCallLogs] = useState([]);
  const [dataToShow, setDataToShow] = useState([]);
  const [dataStatistic, setDataStatistic] = useState({
    totalSuccessCall: {
      total: 0,
      totalDuration: "",
    },
    totalCallFromNameA: {
      total: 0,
      totalDuration: "",
    },
    totalCallFromNameB: {
      total: 0,
      totalDuration: "",
    },
    totalMissedCall: {
      total: 0,
      fromNameA: 0,
      fromNameB: 0,
    },
  });
  const [dataHourCall, setDataHourCall] = useState<any>({
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
      const { status } = info.file;
      if (status === "done") {
        // Helper function to read a file as text
        const readFileAsText = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (e) => resolve(e?.target?.result as string);
            reader.onerror = () => reject(new Error("Failed to read the file."));
          });
        };

        const processFiles = async () => {
          try {
            const callLogsObject: callLogType[] = [];

            // Process each file in the fileList
            await Promise.all(
              info.fileList.map(async (fileItem) => {
                const file = fileItem.originFileObj;
                if (file) {
                  const fileContent = await readFileAsText(file); // Read file as text
                  const jsonData = JSON.parse(fileContent); // Parse JSON data

                  const messages = jsonData.messages || [];
                  const participants = jsonData.participants || [];
                  const nameA = decode(participants[0]?.name || "");
                  const nameB = decode(participants[1]?.name || "");

                  // Set names for participants
                  if (!name1 && !name2) {
                    setName1(nameA);
                    setName2(nameB);
                  }

                  // Filter and add call logs with call duration
                  messages.forEach((item: callLogType) => {
                    if (item?.call_duration >= 0) {
                      callLogsObject.push(item);
                    }
                  });
                }
              })
            );

            // Set raw call logs after processing all files
            setRawCallLogs(callLogsObject as any);

            // Display success message after processing is complete
            messageApi.success(`${info.file.name} file uploaded successfully.`);
          } catch (error) {
            messageApi.error("Failed to process the file. Please ensure it contains valid JSON.");
          }
        };

        // Start processing files
        processFiles();
      } else if (status === "error") {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },

    onRemove() {
      setRawCallLogs([]);
      setDataToShow([]);
    },
  };

  const columns: TableColumnsType<callLogType> = [
    {
      title: <span className="block font-bold text-base text-center">Date</span>,
      dataIndex: "date",
      key: "date",
      width: "15%",
      align: "center",
      filters: [
        {
          text: "January ",
          value: "January ",
        },
        {
          text: "February",
          value: "February",
        },
        {
          text: "March",
          value: "March",
        },
        {
          text: "April",
          value: "April",
        },
        {
          text: "May",
          value: "May",
        },
        {
          text: "June",
          value: "June",
        },
        {
          text: "July",
          value: "July",
        },
        {
          text: "August",
          value: "August",
        },
        {
          text: "September",
          value: "September",
        },
        {
          text: "October",
          value: "October",
        },
        {
          text: "November",
          value: "November",
        },
        {
          text: "December",
          value: "December",
        },
      ],
      onFilter: (value: any, record: callLogType) => record.date.startsWith(value),
    },

    {
      title: <span className="font-bold text-base">Sender</span>,
      dataIndex: "sender_name",
      key: "sender_name",
      align: "center",
      width: "20%",
    },
    {
      title: <span className="font-bold text-base">Content</span>,
      dataIndex: "content",
      key: "content",
      align: "center",
      width: "20%",
    },
    {
      title: <span className="font-bold text-base">Call End Time At</span>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: "15%",
      render: (text: string) => <p className="text-base tracking-wide">{text}</p>,
    },
    {
      title: <span className="font-bold text-base">Call Duration</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "15%",
      align: "center",
      render: (text: string) => <p className="font-bold text-base tracking-wide">{text}</p>,
    },

    // {
    //   title: <span className="font-bold text-base">Action</span>,
    //   key: "action",
    //   align: "center",
    //   width: "15%",
    //   render: (value, record) => {
    //     return (
    //       <p
    //         className="text-[red] cursor-pointer"
    //         onClick={() => {
    //           console.log(record);
    //           if (window.confirm("Do you really delete this time ?")) {
    //             const objectToRemove = record;
    //             const rawLogs = [...rawCallLogs];

    //             const rawLogsFiltered = rawLogs.filter((obj: callLogType) => {
    //               return obj.timestamp_ms !== objectToRemove.timestamp_ms;
    //             });

    //             setRawCallLogs(rawLogsFiltered);
    //           } else {
    //             return;
    //           }
    //         }}
    //       >
    //         Delete
    //       </p>
    //     );
    //   },
    // },
  ];

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Call log history statistics",
      children: (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 3xl:grid-cols-3">
            <Card title="Total success call and duration" hoverable={true} className="">
              <div className="flex flex-col gap-y-3">
                <p>
                  {dataStatistic?.totalSuccessCall?.total
                    ? dataStatistic.totalSuccessCall.total
                    : 0}{" "}
                  times
                </p>
                <p className="tracking-[.1em]">
                  {dataStatistic?.totalSuccessCall?.totalDuration
                    ? dataStatistic.totalSuccessCall.totalDuration
                    : 0}
                </p>
              </div>
            </Card>
            <Card title={`Total call from ${name1} and duration`} hoverable={true} className="">
              <div className="flex flex-col gap-y-3">
                <p>
                  {dataStatistic?.totalCallFromNameA?.total
                    ? dataStatistic.totalCallFromNameA.total
                    : 0}{" "}
                  times
                </p>
                <p className="tracking-[.1em]">
                  {dataStatistic?.totalCallFromNameA?.totalDuration
                    ? dataStatistic.totalCallFromNameA.totalDuration
                    : 0}
                </p>
              </div>
            </Card>
            <Card title={`Total call from ${name2} and duration`} hoverable={true} className="">
              <div className="flex flex-col gap-y-3">
                <p>
                  {dataStatistic?.totalCallFromNameB?.total
                    ? dataStatistic.totalCallFromNameB.total
                    : 0}{" "}
                  times
                </p>
                <p className="tracking-[.1em]">
                  {dataStatistic?.totalCallFromNameB?.totalDuration
                    ? dataStatistic.totalCallFromNameB.totalDuration
                    : 0}
                </p>
              </div>
            </Card>
            <Card title="Total missed call" hoverable={true} className="">
              <div className="flex flex-col gap-y-3">
                <p>
                  {dataStatistic?.totalMissedCall?.total ? dataStatistic.totalMissedCall.total : 0}{" "}
                  times
                </p>
              </div>
            </Card>
            <Card title={`Total missed call from ${name1}`} hoverable={true} className="">
              <p>
                {dataStatistic?.totalMissedCall?.fromNameA
                  ? dataStatistic.totalMissedCall.fromNameA
                  : 0}{" "}
                times
              </p>
            </Card>
            <Card title={`Total missed call from ${name2}`} hoverable={true} className="">
              <p>
                {dataStatistic?.totalMissedCall?.fromNameB
                  ? dataStatistic.totalMissedCall.fromNameB
                  : 0}{" "}
                times
              </p>
            </Card>
          </div>
          <div className="flex flex-col gap-y-6 justify-evenly w-auto mt-5 lg:flex-row ">
            <div className="w-[100%] 2xl:w-[60%]">
              <Bar options={dataHourCall?.options} data={dataHourCall?.data} />
            </div>
          </div>
        </>
      ),
    },
  ];

  // Clean data when new Raw Data is detected
  // Decode string
  // Calculate statistic
  // Convert timestamps to human hour
  useEffect(() => {
    // recalculate the statistic
    const nameA = name1;
    const nameB = name2;
    const rawLogs = rawCallLogs;

    let totalCallDuration = 0;
    let totalCallFromNameA = 0;
    let totalCallDurationFromNameA = 0;
    let totalCallFromNameB = 0;
    let totalCallDurationFromNameB = 0;
    let totalMissedCallFromNameA = 0;
    let totalMissedCallFromNameB = 0;

    const modifiedCallLogs = rawLogs.map((item: any) => {
      const sender = decode(item.sender_name || "");
      const content = decode(item.content || "");

      // calculate total call hour
      totalCallDuration = totalCallDuration + item.call_duration;

      // calculate total missed called from name A
      if (sender === nameA && item.call_duration === 0) {
        totalMissedCallFromNameA += 1;
      }

      // calculate total called from name A
      if (sender === nameA && item.call_duration > 0) {
        totalCallFromNameA += 1;
        totalCallDurationFromNameA += item.call_duration;
      }

      // calculate total missed called from name B
      if (sender === nameB && item.call_duration === 0) {
        totalMissedCallFromNameB += 1;
      }

      // calculate total called from name A
      if (sender === nameB && item.call_duration > 0) {
        totalCallFromNameB += 1;
        totalCallDurationFromNameB += item.call_duration;
      }

      // convert timestamp to date and hour
      const date = new Date(item.timestamp_ms);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
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
        date: formattedDate,
        time: formattedTime,
        call_duration: formattedDuration,
      };
    });

    console.log("modified", modifiedCallLogs);

    // Sort call logs by date
    modifiedCallLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    // sessionStorage.setItem("name1", decode(participants[0]?.name || ""));
    // sessionStorage.setItem("name2", decode(participants[1]?.name || ""));

    setDataToShow(modifiedCallLogs as any);
  }, [rawCallLogs]);

  useEffect(() => {
    const statistic = dataStatistic;
    const nameA = name1;
    const nameB = name2;

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
          label: nameA,
          data: [totalHourFromNameA, totalSuccessCallFromNameA, totalMissedCallFromNameA],
          backgroundColor: "rgba(24, 74, 182, 0.5)",
        },
        {
          label: nameB,
          data: [totalHourFromNameB, totalSuccessCallFromNameB, totalMissedCallFromNameB],
          backgroundColor: "rgba(226, 18, 167, 0.5)",
        },
      ],
    };

    setDataHourCall({ ...dataHourCall, data: dataChartHour });
  }, [dataStatistic]);

  return (
    <>
      {contextHolder}
      <div className="mt-10 w-[80%] m-auto">
        <div className="mt-5">
          <Dragger className="block m-auto mt-20 lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%]" {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click to this area to upload</p>
            <p className="ant-upload-hint">Support for a multiple upload. Only support JSON file</p>
            <Link
              href="/guide"
              className="ant-upload-hint"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Do not have JSON file? Go here to find it
            </Link>
          </Dragger>
        </div>
        <div className="flex flex-col gap-y-10 mt-5">
          <Collapse items={items} />
        </div>

        {dataToShow && dataToShow.length > 0 ? (
          <Table
            pagination={{ showSizeChanger: true }}
            size="large"
            title={() => (
              <div className="flex text-center items-center font-bold text-2xl py-2">
                Call logs between {name1} and {name2} on{" "}
                <span>
                  <FaFacebookSquare style={{ color: "#0866FF", marginLeft: 12, fontSize: 30 }} />{" "}
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
            )}
            columns={columns}
            dataSource={dataToShow}
            className="mt-5"
            scroll={{ x: "max-content", y: 55 * 20 }}
          />
        ) : (
          <>
            <Table
              size="middle"
              title={() => (
                <div className="flex text-center font-bold text-2xl py-2">
                  This is a sample data table
                </div>
              )}
              columns={columns as any}
              dataSource={sample}
              className="mt-5"
              scroll={{ x: "max-content" }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CallLog;
