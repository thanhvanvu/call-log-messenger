import html2canvas from "html2canvas"; // Import html2canvas
import {
  Button,
  Checkbox,
  CheckboxProps,
  ColorPicker,
  ColorPickerProps,
  GetProp,
  Input,
  Modal,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FaFilePdf, FaStarOfLife } from "react-icons/fa";
import { useTranslations } from "next-intl";
import ChatLogExport from "./ChatLogExport";
import { isDesktop, isMobile } from "react-device-detect";
import ChatLogExportMobile from "./ChatLogExport.mobile";
import jsPDF from "jspdf"; // Ensure you have jsPDF installed

interface IProps {
  isShowModal: boolean;
  setIsShowModal: (v: boolean) => void;
}

type Color = GetProp<ColorPickerProps, "value">;

const ChatLogPdfSetting = (props: IProps) => {
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

  const componentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Chat-logs",

    onAfterPrint: () => {
      setTriggerPrint(false);
      setIsloading(false);
    },
  });

  const handleExportChatLog = async () => {
    setIsloading(true);

    if (isMobile) {
      const element = document.getElementById("element-to-capture");

      if (!element) {
        console.error("Element not found!");
        return;
      }

      try {
        // Use html2canvas to capture the element as an image
        const canvas = await html2canvas(element, {
          scale: 2, // Use higher scale for better quality
          useCORS: true,
          backgroundColor: "#ffffff", // Set white background if required
        });

        // Convert the canvas to an image URL
        const imgData = canvas.toDataURL("image/jpeg", 1); // Convert canvas to JPG image data

        // Create a new jsPDF instance with Letter size (215.9 x 279.4 mm)
        const doc = new jsPDF({
          unit: "mm", // Set unit to millimeters (default is mm)
          format: [215.9, 279.4], // Letter size in mm (8.5 x 11 inches)
        });

        // Add the image to the PDF (adjust the position and size based on the Letter size)
        // Assuming you want to fit the image inside the Letter page size
        const pageWidth = doc.internal.pageSize.width; // Width of the Letter size page
        const pageHeight = doc.internal.pageSize.height; // Height of the Letter size page
        const imageWidth = pageWidth - 16; // Leave some margin (10mm on each side)
        const imageHeight = (canvas.height * imageWidth) / canvas.width; // Maintain aspect ratio

        doc.addImage(imgData, "JPEG", 10, 10, imageWidth, imageHeight);

        // Save the PDF
        doc.save("exported-image.pdf"); // Save with the desired file name
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        // Make sure to stop loading state after completion
        setIsloading(false);
      }
    }

    if (isMobile) {
      const element = document.getElementById("element-to-capture");

      if (!element) {
        console.error("Element not found!");
        return;
      }

      try {
        // Use html2canvas to capture the element as an image
        const canvas = await html2canvas(element, {
          scale: 2, // Use higher scale for better quality
          useCORS: true,
          backgroundColor: "#ffffff", // Set white background if required
        });

        // Convert the canvas to an image URL
        const imgData = canvas.toDataURL("image/jpeg", 1); // Convert canvas to JPG image data

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add the image to the PDF (you can adjust the image position and size)
        doc.addImage(imgData, "JPEG", 0, 0, 180, 160); // (imgData, format, x, y, width, height)

        // Save the PDF
        doc.save("exported-image.pdf"); // Save with the desired file name
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        // Make sure to stop loading state after completion
        setIsloading(false);
      }
    }
  };

  const handleExportImage = async () => {};

  useEffect(() => {
    if (triggerPrint) {
      reactToPrintFn();
    }
  }, [triggerPrint]);

  return (
    <Modal
      title="&nbsp;"
      footer={[
        <Button key="back" onClick={() => setIsShowModal(false)}>
          {t("pdf-setting.cancel")}
        </Button>,
        <Button
          loading={isLoading}
          key="submit"
          type="primary"
          danger
          onClick={handleExportChatLog}
        >
          <FaFilePdf />
          Export Chat Log
        </Button>,
      ]}
      open={isShowModal}
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
      <div className={`mt-3 flex flex-col gap-3  ${chatLogPdfSetting.title ? "" : "disabled"}`}>
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

      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
        }}
      >
        <ChatLogExport contentRef={componentRef} chatLogPdfSetting={chatLogPdfSetting} />
        <ChatLogExportMobile chatLogPdfSetting={chatLogPdfSetting} />
      </div>
    </Modal>
  );
};

export default ChatLogPdfSetting;
