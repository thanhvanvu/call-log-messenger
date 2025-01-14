"use client";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useRef, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Table, TableColumnsType, Upload, UploadFile, UploadProps } from "antd";
import { FaFacebookSquare } from "react-icons/fa";
import { data } from "@/app/utils/dataUltis";

interface callLogType {
  call_duration: string;
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

function decode(s: string) {
  const decoder = new TextDecoder();
  const charCodes = Array.from(s).map((char) => char.charCodeAt(0));
  return decoder.decode(new Uint8Array(charCodes));
}
const sample = data;

const HomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [files, setFiles] = useState([]);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const props: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
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
        messageApi.success(`${info.file.name} file uploaded successfully.`);
        const file = info.fileList[0]?.originFileObj;
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file, "UTF-8");
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e?.target?.result as string);
              const messages = jsonData.messages || [];
              const participants = jsonData.participants || [];

              const callLogs = messages
                .filter((obj: any) => obj.hasOwnProperty("call_duration"))
                .map((item: any) => {
                  item.sender_name = decode(item.sender_name || "");
                  item.content = decode(item.content || "");

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
                    date: formattedDate,
                    time: formattedTime,
                    call_duration: formattedDuration,
                  };
                })
                .reverse();

              setName1(decode(participants[0]?.name || ""));
              setName2(decode(participants[1]?.name || ""));

              console.log(callLogs);

              // save to sessionStorage
              sessionStorage.setItem("myData", JSON.stringify(callLogs));
              sessionStorage.setItem("name1", decode(participants[0]?.name || ""));
              sessionStorage.setItem("name2", decode(participants[1]?.name || ""));

              setFiles(callLogs);
            } catch (error) {
              messageApi.error("Failed to parse the file. Please ensure it's valid JSON.");
            }
          };
        }
      } else if (status === "error") {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },

    onRemove() {
      setFiles([]);
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
      title: <span className="font-bold text-base">Time</span>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: "20%",
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
      title: <span className="font-bold text-base">Call Duration</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "18%",
      align: "center",
      render: (text: string) => <p className="font-bold text-base">{text}</p>,
    },
    {
      title: <span className="font-bold text-base">Action</span>,
      key: "action",
      align: "center",
      width: "15%",
      render: (value, record, index) => {
        return (
          <p
            ref={index === 0 ? ref2 : null}
            className="text-[red] cursor-pointer"
            onClick={() => {
              if (window.confirm("Do you really delete this time ?")) {
                const objectToRemove = record;
                let initalFile = files;

                initalFile = initalFile.filter((obj: callLogType) => {
                  return obj.timestamp_ms !== objectToRemove.timestamp_ms;
                });

                // save to sessionStorage
                sessionStorage.setItem("myData", JSON.stringify(initalFile));
                setFiles(initalFile);
              } else {
                return;
              }
            }}
          >
            Delete
          </p>
        );
      },
    },
  ];

  useEffect(() => {
    const storedData = sessionStorage.getItem("myData");
    const name1 = sessionStorage.getItem("name1");
    const name2 = sessionStorage.getItem("name2");
    if (storedData && name1 && name2) {
      try {
        const callLogsObject = JSON.parse(storedData);
        setName1(name1);
        setName2(name2);
        setFiles(callLogsObject);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    }
  }, []);

  return (
    <>
      {contextHolder}
      <div className="mt-10 w-[80%] m-auto">
        <div className="mt-5">
          <Dragger className="block w-[70%] m-auto mt-20" {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click to this area to upload</p>
            <p className="ant-upload-hint">Support for a single upload. Only support JSON file</p>
          </Dragger>
        </div>

        {files && files.length > 0 ? (
          <Table
            size="large"
            title={() => (
              <div className="flex text-center font-bold text-2xl py-2">
                Call logs between {name1} and {name2} on{" "}
                <span>
                  <FaFacebookSquare style={{ color: "#0866FF", marginLeft: 12 }} />{" "}
                </span>
              </div>
            )}
            columns={columns}
            dataSource={files}
            className="mt-5"
          />
        ) : (
          <>
            <Table
              size="middle"
              title={() => (
                <div className="flex text-center font-bold text-2xl py-2">
                  This is sample data table
                </div>
              )}
              columns={columns}
              dataSource={sample}
              className="mt-5"
            />
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
