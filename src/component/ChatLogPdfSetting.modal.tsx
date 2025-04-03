import { useCurrentApp } from "@/context/app.context";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  ColorPicker,
  ColorPickerProps,
  Divider,
  GetProp,
  Input,
  Modal,
  Row,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PdfExport from "./PdfExport";
import Image from "next/image";
import { FaFilePdf, FaStarOfLife } from "react-icons/fa";
import { MdRectangle } from "react-icons/md";
import { useTranslations } from "next-intl";
import { decode } from "@/utils/helper";
import ChatLogExport from "./ChatLogExport";

interface IProps {
  isShowModal: boolean;
  setIsShowModal: (v: boolean) => void;
}

type Color = GetProp<ColorPickerProps, "value">;

const ChatLogPdfSetting = (props: IProps) => {
  const { dataPdf, dataStatistic, rawCallLogs, dateRange } = useCurrentApp();
  const { isShowModal, setIsShowModal } = props;
  const [chatLogPdfSetting, setChatLogPdfSetting] = useState({
    title: false,
    titleContent: "",
    titleColor: "#FFFFFF",
    backgroundColor: "#2196F3",
  });
  const [triggerPrint, setTriggerPrint] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const t = useTranslations();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Chat-logs",

    onAfterPrint: () => {
      setTriggerPrint(false);
      setIsloading(false);
    },
  });

  const handleExportPdf = () => {
    setIsloading(true);

    // set state, make sure filter function is completely before print
    setTriggerPrint(true);
  };

  useEffect(() => {
    if (triggerPrint) {
      reactToPrintFn();
    }
  }, [triggerPrint]);

  const onChangeShowTitle: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <Modal
      title="&nbsp;"
      footer={[
        <Button key="back" onClick={() => setIsShowModal(false)}>
          {t("pdf-setting.cancel")}
        </Button>,
        <Button loading={isLoading} key="submit" type="primary" danger onClick={handleExportPdf}>
          <FaFilePdf />
          {t("pdf-setting.export")}
        </Button>,
      ]}
      onOk={handleExportPdf}
      open={isShowModal}
      width={"30%"}
      styles={{ body: { overflowY: "auto", maxHeight: "calc(100vh - 300px)" } }}
      onCancel={() => {
        setIsShowModal(false);
      }}
    >
      <Checkbox
        onChange={(e) => {
          setChatLogPdfSetting({ ...chatLogPdfSetting, title: e.target.checked });
        }}
      >
        Include title header ?
      </Checkbox>

      <div className="hidden"></div>
      <div className={`mt-3 flex flex-col gap-3 ${chatLogPdfSetting.title ? "" : "disabled"}`}>
        <div className="flex gap-2 items-center">
          Title name:{" "}
          <Input
            placeholder="July 4th 2025..."
            style={{ width: "50%" }}
            onChange={(e) => {
              const newChatLogPdfSetting = { ...chatLogPdfSetting };
              newChatLogPdfSetting.titleContent = e.target.value;
              setChatLogPdfSetting(newChatLogPdfSetting);
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          Title color:
          <ColorPicker
            showText
            value={chatLogPdfSetting.titleColor}
            onChange={(value: Color, css: string) => {
              console.log(css);
              setChatLogPdfSetting({ ...chatLogPdfSetting, titleColor: css });
            }}
          />
        </div>

        <div className="flex gap-2 items-center">
          Background color:
          <ColorPicker
            showText
            value={chatLogPdfSetting.backgroundColor}
            onChange={(value: Color, css: string) => {
              console.log(css);
              setChatLogPdfSetting({ ...chatLogPdfSetting, backgroundColor: css });
            }}
          />
        </div>
        <h1
          className="text-xl font-bold text-center border h-[35px]"
          style={{
            backgroundColor: chatLogPdfSetting.backgroundColor,
            color: chatLogPdfSetting.titleColor,
          }}
        >
          {chatLogPdfSetting?.titleContent}
        </h1>
      </div>

      <div className="hidden">
        <ChatLogExport contentRef={contentRef} chatLogPdfSetting={chatLogPdfSetting} />
      </div>
    </Modal>
  );
};

export default ChatLogPdfSetting;
