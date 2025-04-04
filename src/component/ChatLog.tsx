"use client";
// https://www.youtube.com/watch?v=dL5SOdgMbRY&ab_channel=CodeComplete (guide how to use drag)
import { readFileAsImage, validateFileType } from "@/utils/helper";
import {
  Button,
  Collapse,
  CollapseProps,
  Image,
  message,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useTranslations } from "next-intl";
import { InboxOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useCurrentApp } from "@/context/app.context";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import ImageInformation from "./ImageInformation";
import { useReactToPrint } from "react-to-print";
import { RiDragMove2Fill } from "react-icons/ri";
import ChatLogPdfSetting from "./ChatLogPdfSetting.modal";
import ChatLogMobile from "./ChatLog.Mobile";
import { isMobile, isTablet } from "react-device-detect";

const ChatLog = () => {
  const { chatLogImages, setChatLogImages } = useCurrentApp();
  const [triggerPrint, setTriggerPrint] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const t = useTranslations();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Call-logs",

    onAfterPrint: () => {
      setTriggerPrint(false);
    },
  });

  useEffect(() => {
    if (triggerPrint) {
      reactToPrintFn();
    }
  }, [triggerPrint]);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg",

    beforeUpload: (file: UploadFile) => {
      const allowedTypes: string[] = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
        "image/gif",
        "image/apng",
      ];
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
      const fileListFiltered = fileList.filter((item) => item.uid != file.uid);
      setFileList(fileListFiltered);
    },
  };

  useEffect(() => {
    const processFiles = async () => {
      const chatLogArray: IChatLog[] = [];
      for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index].originFileObj;
        if (file) {
          const fileContent = await readFileAsImage(file); // Read file as text

          chatLogArray.push({
            id: index,
            imageUrl: fileContent,
            note: "",
          });
        }
      }
      setChatLogImages(chatLogArray);
    };

    try {
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to process the file. Please ensure it contains valid JSON.");
    }
    // Start processing files
    processFiles();
  }, [fileList]);

  const getImageInformationPos = (id: number) => {
    return chatLogImages.findIndex((element) => element.id === id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    // @ts-ignore
    setChatLogImages((chatLogImages: any) => {
      const originalPos = getImageInformationPos(active.id);
      const newPos = getImageInformationPos(over.id);
      return arrayMove(chatLogImages, originalPos, newPos);
    });
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "How to upload images",
      children: (
        <div>
          <ul className="list-disc list-inside ml-4 text-gray-700 mt-2 flex flex-col gap-3">
            <li>
              <div className="inline-block">
                <p className="flex items-center">
                  <span className="font-bold underline mr-2">Step 1:</span> Screenshot messenger
                  chat log from your mobile phone and transfer those to laptop or computer.
                </p>
              </div>
              <div className="flex justify-center gap-5 mt-2">
                <Image
                  alt=""
                  src="/demo-chat-log/1.jpg"
                  width={100}
                  className="border shadow-md"
                ></Image>
                <Image
                  alt=""
                  src="/demo-chat-log/2.jpg"
                  width={100}
                  className="border shadow-md"
                ></Image>
                <Image
                  alt=""
                  src="/demo-chat-log/3.jpg"
                  width={100}
                  className="border shadow-md"
                ></Image>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="flex items-center">
                  <span className="font-bold underline mr-2">Step 2:</span>
                  Click this
                  <InboxOutlined className="text-2xl mx-2" style={{ color: "#2196F3" }} /> in the
                  box above to upload your images (hold <kbd className="mx-2">CTRL</kbd> to select
                  multiple images).
                </p>
              </div>
            </li>
            <li>
              <div className="inline-block">
                <p className="flex items-center">
                  <span className="font-bold underline mr-2">Step 3:</span>
                  Click and hold the
                  <Button
                    type="primary"
                    icon={<RiDragMove2Fill className="" />}
                    size="small"
                    className="mx-2"
                  >
                    Drag
                  </Button>
                  button, then drag to rearrange your images if needed.
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="flex items-center">
                  <span className="font-bold underline mr-2">Step 4:</span>
                  Add a note for each image if necessary.
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="flex items-center">
                  <span className="font-bold underline mr-2">Step 5:</span>
                  Click this
                  <Button danger color="danger" size="small" className="mx-2">
                    <SettingOutlined />
                    {t("common.export-pdf.button")}
                  </Button>{" "}
                  button to export a PDF file.
                </p>
              </div>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      {isMobile || isTablet ? (
        <ChatLogMobile />
      ) : (
        <div className="mt-10 w-[90%] m-auto 3xl:w-[80%] pb-14 h-full">
          <div className="mt-4">
            <Dragger className="block m-auto mt-20 lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%]" {...props}>
              <div className="">
                <p className="ant-upload-drag-icon ">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click to this area to upload images</p>
                <p className="ant-upload-hint">
                  Support for a multiple upload. Only support images file (JPG, PNG)
                </p>
              </div>
            </Dragger>
          </div>

          <div className="flex justify-center mt-4 w-[100%]">
            <Collapse items={items} className="w-[100%] lg:w-[85%] 2xl:w-[60%] 3xl:w-[40%]" />
          </div>

          {fileList && fileList.length > 0 ? (
            <div className="  w-[100%] lg:w-[85%] 2xl:w-[60%] m-auto mt-5">
              <div className="flex items-center justify-between">
                <div className="text-center font-bold text-2xl py-2">
                  <h1 className="">These are chat log images:</h1>
                </div>
                <div className="flex gap-4">
                  <Button
                    danger
                    color="danger"
                    onClick={() => {
                      console.log(chatLogImages);
                      setIsShowModal(true);
                    }}
                  >
                    <SettingOutlined />
                    {t("common.export-pdf.button")}
                  </Button>
                </div>
              </div>

              <div className="italic flex items-center gap-2">
                Hold mouse on
                <Button type="primary" icon={<RiDragMove2Fill className="" />} size="middle">
                  Drag
                </Button>
                button to change the order of pictures below
              </div>

              <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="grid gap-x-14 gap-y-10 m-auto mt-5 992:grid-cols-2 ">
                  <SortableContext items={chatLogImages} strategy={rectSortingStrategy}>
                    {chatLogImages &&
                      chatLogImages.map((image, index) => {
                        return (
                          <ImageInformation
                            id={image.id}
                            image={image}
                            key={image.id}
                            index={index}
                          />
                        );
                      })}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          ) : (
            <div className="h-screen flex flex-col justify-center items-center mt-4">
              <div className="w-[100%] lg:w-[85%] 2xl:w-[60%] h-screen">
                <h1 className="font-bold text-2xl py-2">Demo Chat Logs PDF:</h1>
                <iframe src="/chatLogExample.pdf" className="w-full h-full border-none"></iframe>
              </div>
            </div>
          )}
        </div>
      )}

      <ChatLogPdfSetting isShowModal={isShowModal} setIsShowModal={setIsShowModal} />
    </>
  );
};

export default ChatLog;
