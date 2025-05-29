"use client";
import React from "react";
import { useCurrentApp } from "@/context/app.context";
import { Alert, Card, Table } from "antd";
import { IoMdCall } from "react-icons/io";
import { HiPhoneMissedCall } from "react-icons/hi";
import { FaFacebookSquare } from "react-icons/fa";

interface IProps {
  contentRef: any;
  isShowStatistic?: boolean;
  dataPDFToPrint: IDataPdf[];
  highlightCallData: IHighlightCallData;
  isHideMissedCall: boolean;
}

const PdfExport = (props: IProps) => {
  const { contentRef, isShowStatistic, dataPDFToPrint, highlightCallData, isHideMissedCall } =
    props;
  const { participants } = useCurrentApp();

  const columns: any = [
    {
      title: <span className="block text-base text-center text-white">Date</span>,
      dataIndex: "dateNumber",
      key: "dateNumber",
      width: "10%",
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
      width: "7%",
      render: (text: string) => <p className="tracking-wide">{text}</p>,
    },
    {
      title: <span className=" text-base text-white">Call Duration</span>,
      dataIndex: "call_duration",
      key: "call_duration",
      width: "7%",
      align: "center",
      render: (text: string) => <p className="font-bold  tracking-wide">{text}</p>,
    },
  ];

  return (
    <>
      <div className="w-[8.5in] mx-auto px-8  bg-white " ref={contentRef}>
        {dataPDFToPrint.map((data, index) => {
          const dateRange = data?.dateRange;
          const dataStatistic = data?.statistic;
          const dataToPrint = data?.callLogToShow;
          return (
            <div key={index}>
              <h1 className="text-2xl font-bold text-center ">
                Call Logs between <span className="underline">{participants?.nameA}</span> and{" "}
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

              <div className="w-fit mx-auto">
                <p className="text-left mt-3 text-xl ">
                  <span className="font-bold ">Period:</span> {dateRange?.from} - {dateRange?.to}
                </p>

                {isShowStatistic ? (
                  <></>
                ) : (
                  <>
                    <p className="text-left mt-3 ">
                      <span className="font-bold ">Total:</span>{" "}
                      {isHideMissedCall
                        ? dataStatistic?.totalSuccessCall?.total
                        : dataStatistic?.totalMissedCall?.total +
                          dataStatistic?.totalSuccessCall?.total}{" "}
                      records
                    </p>
                    <p className="text-left mt-3 ">
                      <span className="font-bold ">duration:</span>{" "}
                      {dataStatistic?.totalSuccessCall?.totalDurationInHourFormat
                        ? dataStatistic.totalSuccessCall.totalDurationInHourFormat
                        : 0}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-[40px]">
                <Alert
                  showIcon
                  message="Data Integrity Assurance"
                  description={
                    <p className="text-justify">
                      These call and video logs have never been modified in any way and are
                      presented in their original, unaltered form as recorded in the Facebook
                      Accounts Centre. The data remains exactly as it was retrieved, ensuring
                      complete accuracy and authenticity.;
                    </p>
                  }
                  type="info"
                />
              </div>

              {isShowStatistic && (
                <>
                  <div className="font-bold mt-[40px] text-xl ml-1">
                    Detailed Call Log Statistics:{" "}
                    {isHideMissedCall
                      ? dataStatistic?.totalSuccessCall?.total
                      : dataStatistic?.totalMissedCall?.total +
                        dataStatistic?.totalSuccessCall?.total}{" "}
                    records
                  </div>
                  <div
                    className={`grid ${
                      isHideMissedCall ? "grid-cols-1" : "grid-cols-2"
                    } gap-4 mt-[15px] page-break`}
                  >
                    <Card
                      title={
                        <div className="flex items-center gap-2 color-[#28a745] ">
                          <IoMdCall className="text-[#28a745]" />
                          Total success calls
                        </div>
                      }
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
                    {isHideMissedCall === false && (
                      <Card
                        title={
                          <div className="flex items-center gap-2">
                            <HiPhoneMissedCall className="text-[#f44336]" />
                            Total missed calls
                          </div>
                        }
                        className="shadow-md"
                      >
                        <div className="flex flex-col gap-y-3">
                          <p className="text-[#f44336]">
                            {dataStatistic?.totalMissedCall?.total
                              ? dataStatistic.totalMissedCall.total
                              : 0}{" "}
                            times
                          </p>
                        </div>
                      </Card>
                    )}

                    <Card
                      title={
                        <div className="flex items-center gap-2">
                          <IoMdCall className="text-[#28a745]" />
                          Total calls from {participants?.nameA}
                        </div>
                      }
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

                    {isHideMissedCall === false && (
                      <Card
                        title={
                          <div className="flex items-center gap-2">
                            <HiPhoneMissedCall className="text-[#f44336]" />
                            {participants?.nameA} missed total of calls
                          </div>
                        }
                        className="shadow-md"
                      >
                        <p className="text-[#f44336]">
                          {dataStatistic?.totalMissedCall?.fromNameB
                            ? dataStatistic.totalMissedCall.fromNameB
                            : 0}{" "}
                          times
                        </p>
                      </Card>
                    )}

                    <Card
                      title={
                        <div className="flex items-center gap-2">
                          <IoMdCall className="text-[#28a745]" />
                          Total calls from {participants?.nameB}
                        </div>
                      }
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

                    {isHideMissedCall === false && (
                      <Card
                        title={
                          <div className="flex items-center gap-2">
                            <HiPhoneMissedCall className="text-[#f44336]" />
                            {participants?.nameB} missed total of calls
                          </div>
                        }
                        className="shadow-md"
                      >
                        <p className="text-[#f44336]">
                          {dataStatistic?.totalMissedCall?.fromNameA
                            ? dataStatistic.totalMissedCall.fromNameA
                            : 0}{" "}
                          times
                        </p>
                      </Card>
                    )}
                  </div>
                </>
              )}

              <Table
                title={() => (
                  <div className="flex items-center justify-between">
                    <div className="text-center font-bold text-xl py-2">
                      <p className="">
                        Call Logs between {participants?.nameA} and {participants?.nameB}
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
                  </div>
                )}
                pagination={false}
                size="small"
                columns={columns}
                dataSource={dataToPrint}
                className={isShowStatistic ? "page-break" : "page-break mt-4"}
                rowClassName={(record) =>
                  record?.call_duration === "00:00:00" &&
                  highlightCallData?.missedCall &&
                  isHideMissedCall === false
                    ? "call-logs-table-row-pdf missed-call-row"
                    : record?.call_duration !== "00:00:00" && highlightCallData?.successCall
                    ? "call-logs-table-row-pdf success-call-row"
                    : record?.call_duration === "00:00:00" && isHideMissedCall
                    ? "hidden"
                    : "call-logs-table-row-pdf "
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PdfExport;
