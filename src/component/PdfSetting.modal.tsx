import { useCurrentApp } from "@/context/app.context";
import { Button, Checkbox, CheckboxProps, Col, Divider, Modal, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PdfExport from "./PdfExport";
import Image from "next/image";
import { FaFilePdf, FaStarOfLife } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface IProps {
  isShowModal: boolean;
  setIsShowModal: (v: boolean) => void;
}

const PdfSettingModal = (props: IProps) => {
  const { dataPdf } = useCurrentApp();
  const { isShowModal, setIsShowModal } = props;
  const { dateFilter } = useCurrentApp();
  const [filterPdf, setFilterPdf] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [dataPDFToPrint, setDataPDFToPrint] = useState<IDataPdf[]>([]);
  const [isShowStatistic, setIsShowStatistic] = useState<boolean>(false);
  const [isShowHighlightMissedCall, setIsShowHighlightMissedCall] = useState<boolean>(false);
  const [triggerPrint, setTriggerPrint] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const t = useTranslations();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Call-logs",

    onAfterPrint: () => {
      setTriggerPrint(false);
      setIsloading(false);
    },
  });

  const checkAll = filterPdf.length > 0 && checkedList.length === filterPdf.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < filterPdf.length;
  const onCheckDate = (list: string[]) => {
    setCheckedList(list);
  };
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? [...filterPdf] : []);
  };

  useEffect(() => {
    const filter = dateFilter.map((item) => item?.text);
    setFilterPdf(filter);
    setCheckedList([]);
  }, [dateFilter]);

  const handleExportPdf = () => {
    setIsloading(true);
    const filteredDataPdf = dataPdf.filter((data) => checkedList.includes(data?.monthYear));
    setDataPDFToPrint(filteredDataPdf);

    // set state, make sure filter function is completely before print
    setTriggerPrint(true);
  };

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
          disabled={checkedList.length === 0 ? true : false}
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
      width="30%"
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
      <Divider />
      <div className="w-full ">
        <div className="border-b mb-2 font-bold flex justify-between">
          {t("pdf-setting.option2")}
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
        <div className="border-b mb-2 font-bold flex justify-between">
          {t("pdf-setting.option3")}
        </div>
        <Checkbox onChange={(e) => setIsShowHighlightMissedCall(e.target.checked)}>
          <Image
            src="https://i.imgur.com/5Atbw0a.jpg"
            alt="missed highlight"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </Checkbox>
      </div>

      <div className="hidden">
        <PdfExport
          contentRef={contentRef}
          isShowStatistic={isShowStatistic}
          dataPDFToPrint={dataPDFToPrint}
          isShowHighlightMissedCall={isShowHighlightMissedCall}
        />
      </div>
    </Modal>
  );
};

export default PdfSettingModal;
