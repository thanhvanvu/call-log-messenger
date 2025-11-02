import { useCurrentApp } from "@/context/app.context";
import { Button, Checkbox, CheckboxProps, Divider, Modal } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PdfExport from "./PdfExport";
import Image from "next/image";
import { FaFilePdf, FaStarOfLife } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { decode } from "@/utils/helper";

interface IProps {
  isShowModal: boolean;
  setIsShowModal: (v: boolean) => void;
}

const PdfSettingModal = (props: IProps) => {
  const { dataPdf, dataStatistic, rawCallLogs, dateRange, dateFilter } = useCurrentApp();
  const { isShowModal, setIsShowModal } = props;
  const [filterPdf, setFilterPdf] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [dataPDFToPrint, setDataPDFToPrint] = useState<IDataPdf[]>([]);
  const [isShowStatistic, setIsShowStatistic] = useState<boolean>(false);
  const [highlightCallData, setHighlightCallData] = useState<IHighlightCallData>({
    successCall: false,
    missedCall: false,
  });
  const [isHideMissedCall, setIsHideMissedCall] = useState<boolean>(false);
  const [currentTableToPrint, setCurrentTableToPrint] = useState(false);

  const [triggerPrint, setTriggerPrint] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const t = useTranslations();

  const checkAll = filterPdf.length > 0 && checkedList.length === filterPdf.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < filterPdf.length;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Call-logs",

    onAfterPrint: () => {
      setTriggerPrint(false);
      setIsloading(false);
    },
  });

  const onCheckDate = (list: string[]) => {
    setCurrentTableToPrint(false);
    setCheckedList(list);
  };
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCurrentTableToPrint(false);
    setCheckedList(e.target.checked ? [...filterPdf] : []);
  };

  const modifiedCallLogs = useMemo(() => {
    return rawCallLogs.map((item: IRawLogType) => ({
      ...item,
      sender_name: decode(item.sender_name || ""),
      content: decode(item.content || ""),
      time: new Date(item.timestamp_ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      call_duration: new Date(item.call_duration * 1000).toISOString().substr(11, 8), // HH:MM:SS format
    }));
  }, [rawCallLogs]);

  const handleExportPdf = () => {
    setIsloading(true);
    if (currentTableToPrint) {
      setDataPDFToPrint([
        {
          callLogToShow: modifiedCallLogs,
          dateRange: dateRange as IDateRange,
          statistic: dataStatistic,
        },
      ]);
    } else {
      const filteredDataPdf = dataPdf.filter((data) =>
        checkedList.includes(data?.monthYear as string)
      );
      setDataPDFToPrint(filteredDataPdf);
    }
  };

  useEffect(() => {
    if (dataPDFToPrint.length > 0) {
      const timeout = setTimeout(() => {
        setTriggerPrint(true);
      }, 1000); // You can tweak this if needed
      return () => clearTimeout(timeout);
    }
  }, [dataPDFToPrint]);

  useEffect(() => {
    const filter = dateFilter.map((item) => item?.text);
    setFilterPdf(filter);
    setCheckedList([]);
  }, [dateFilter]);

  useEffect(() => {
    if (triggerPrint) {
      reactToPrintFn();
    }
  }, [triggerPrint]);

  return (
    <Modal
      footer={[
        <Button key="back" onClick={() => setIsShowModal(false)}>
          {t("pdf-setting.cancel")}
        </Button>,
        <Button
          loading={isLoading}
          key="submit"
          type="primary"
          danger
          onClick={handleExportPdf}
          disabled={checkedList.length === 0 && currentTableToPrint == false ? true : false}
        >
          <FaFilePdf />
          {t("pdf-setting.export")}
        </Button>,
      ]}
      title="&nbsp;"
      onOk={handleExportPdf}
      open={isShowModal}
      onCancel={() => {
        setIsShowModal(false);
      }}
      width="fit-content"
      styles={{ body: { overflowY: "auto", maxHeight: "calc(100vh - 300px)" } }}
    >
      <div className="border-b mb-2 font-bold flex justify-between">
        <div className="flex gap-1">
          {t("pdf-setting.option1")}
          <FaStarOfLife className="text-[5px] text-red-600" />
        </div>

        <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>
          {t("pdf-setting.check-all")}
        </Checkbox>
      </div>
      <Checkbox.Group style={{ width: "100%" }} onChange={onCheckDate} value={checkedList}>
        <div className="grid grid-cols-4 gap-3">
          {filterPdf.map((filter, index) => {
            return (
              <Checkbox value={filter} key={index}>
                {filter}
              </Checkbox>
            );
          })}
        </div>
      </Checkbox.Group>

      <Checkbox
        onChange={(e) => {
          setCheckedList([]);
          setCurrentTableToPrint(!currentTableToPrint);
        }}
        checked={currentTableToPrint === true}
        value={currentTableToPrint}
        className="mt-4"
      >
        {t("pdf-setting.current-table")}
      </Checkbox>

      <Divider />
      <div className="w-full ">
        <div className="border-b mb-2 font-bold flex justify-between">
          {t("pdf-setting.option2")}
        </div>
        <Checkbox onChange={(e) => setIsHideMissedCall(e.target.checked)}>
          <Image
            src="https://i.imgur.com/DrWzcOz.jpg"
            alt="call log statistic"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </Checkbox>
      </div>

      <Divider />
      <div className="w-full ">
        <div className="border-b mb-2 font-bold flex justify-between">
          {t("pdf-setting.option3")}
        </div>
        <Checkbox onChange={(e) => setIsShowStatistic(e.target.checked)}>
          <Image
            src="https://i.imgur.com/u2QTg6x.jpg"
            alt="call log statistic"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </Checkbox>
      </div>

      <Divider />

      <div className="w-full mb-5 ">
        <div className="border-b mb-2 font-bold">
          <p className="flex">{t("pdf-setting.option4")} </p>
        </div>
        <div className="flex flex-col gap-2">
          <Checkbox
            onChange={(e) =>
              setHighlightCallData({ ...highlightCallData, successCall: e.target.checked })
            }
          >
            <Image
              src="https://i.imgur.com/Jt99Eak.jpg"
              alt="success call highlight"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </Checkbox>
          <Checkbox
            onChange={(e) =>
              setHighlightCallData({ ...highlightCallData, missedCall: e.target.checked })
            }
          >
            <Image
              src="https://i.imgur.com/DrWzcOz.jpg"
              alt="missed call highlight"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </Checkbox>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
        }}
      >
        <PdfExport
          contentRef={contentRef}
          isShowStatistic={isShowStatistic}
          isHideMissedCall={isHideMissedCall}
          dataPDFToPrint={dataPDFToPrint}
          highlightCallData={highlightCallData}
        />
      </div>
    </Modal>
  );
};

export default PdfSettingModal;
