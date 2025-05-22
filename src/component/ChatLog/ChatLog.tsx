"use client";
// https://www.youtube.com/watch?v=dL5SOdgMbRY&ab_channel=CodeComplete (guide how to use drag)
import { readFileAsImage, validateFileType } from "@/utils/helper";
import { Alert, Button, Image, message, Upload, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useTranslations } from "next-intl";
import { InboxOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useCurrentApp } from "@/context/app.context";
import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import ImageInformation from "./ImageInformation";
import { useReactToPrint } from "react-to-print";
import { RiDragMove2Fill } from "react-icons/ri";
import ChatLogPdfSetting from "./ChatLogPdfSetting.modal";
import ChatLogGuide from "./ChatLogGuide";
import { BrowserView, isMobile, isTablet, MobileView } from "react-device-detect";
import { MdDelete } from "react-icons/md";

const ChatLog = () => {
  const { chatLogImages, setChatLogImages } = useCurrentApp();
  const [triggerPrint, setTriggerPrint] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
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
    accept: ".jpg,.jpeg,.png,.svg,.webp,.gif",
    maxCount: isMobile ? 6 : 100000,

    beforeUpload: (file: UploadFile) => {
      const allowedTypes: string[] = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
        "image/gif",
      ];
      const isAllowedType = validateFileType(file, allowedTypes);
      if (!isAllowedType) {
        messageApi.error(`${file.name} is not supported!`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },

    onChange(info) {
      const newFileList = info.fileList.map((file) => {
        // If uploaded, mark as done
        if (file.status === "done" && file.originFileObj) {
          return { ...file, status: "done" };
        }
        return file;
      });
      // @ts-ignore
      setFileList(newFileList);
      const allDone = newFileList.every((file) => file.status === "done");
      const { status } = info.file;

      if (allDone && status === "done") {
        setIsUploadSuccess(true);
        messageApi.success(`${newFileList.length} files uploaded successfully.`);
      } else if (status === "error") {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },

    // onChange(info) {
    //   const newFileList = [...info.fileList];

    //   // Check if all files are uploaded
    //   const allDone = newFileList.every((file) => file.status === "done");
    //   const { status } = info.file;

    //   if (allDone && status == "done") {
    //     setFileList(newFileList);
    //     messageApi.success(`${newFileList.length} files uploaded successfully.`);
    //   } else if (status === "error") {
    //     messageApi.error(`${info.file.name} file upload failed.`);
    //   }
    // },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },

    onRemove(file) {
      if (fileList && fileList.length > 0) {
        const fileListFiltered = fileList.filter((item) => item.uid != file.uid);
        setFileList(fileListFiltered);
      }
    },
  };

  useEffect(() => {
    const processFiles = async () => {
      if (fileList && fileList.length > 0) {
        const chatLogArray: IChatLog[] = [];
        for (let index = 0; index < fileList.length; index++) {
          const file = fileList[index].originFileObj;
          if (file) {
            const fileContent = await readFileAsImage(file); // Read file as text
            chatLogArray.push({
              uid: file.uid,
              id: index,
              imageUrl: fileContent,
              note: "",
            });
          }
        }
        setChatLogImages(chatLogArray);
      }
    };

    try {
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to process the file. Please ensure it contains valid JSON.");
    }
    // Start processing files
    processFiles();

    // for UX bug
    if (fileList.length === 0) {
      setIsUploadSuccess(false);
    }
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

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  return (
    <>
      {contextHolder}
      <div className="mt-10 w-[90%] m-auto 3xl:w-[80%] pb-14 h-full">
        <MobileView>
          <Alert
            className="mt-2"
            message={t("chat-log.warning-title")}
            type="warning"
            showIcon
            description={<div className="">{t("chat-log.warning")}</div>}
            closable
          />
        </MobileView>

        <div className="mt-4">
          <Dragger
            className="block m-auto mt-20 lg:w-[70%] 2xl:w-[60%] 3xl:w-[40%]"
            {...props}
            fileList={fileList}
          >
            <div className="">
              <p className="ant-upload-drag-icon ">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t("chat-log.upload")}</p>
              <p className="ant-upload-hint">{t("chat-log.upload-note")}</p>
            </div>
          </Dragger>
        </div>

        <div className="flex justify-center mt-4 w-[100%]">
          <ChatLogGuide />
        </div>

        {isUploadSuccess === true && fileList && fileList.length > 0 ? (
          <div className="  w-[100%] lg:w-[85%] 2xl:w-[60%] m-auto mt-4">
            <div className="flex items-center justify-between">
              <div className=" font-bold text-2xl py-2">
                <h1 className="hidden md:block">{t("chat-log.image-list-title")}</h1>
              </div>
              <div className="flex gap-4">
                <MobileView>
                  <Button
                    danger
                    color="danger"
                    onClick={() => {
                      console.log(chatLogImages);
                      setIsShowModal(true);
                    }}
                  >
                    <SettingOutlined />
                    {t("chat-log.export-setting.button")}
                  </Button>
                </MobileView>
                <BrowserView>
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
                </BrowserView>
              </div>
            </div>

            <div className="italic mt-3 flex justify-between">
              <span>
                {t.rich("chat-log.drag-guide", {
                  icon: (chunk) => (
                    <Button
                      type="primary"
                      icon={<RiDragMove2Fill />}
                      size="middle"
                      style={{ marginLeft: "10px", marginRight: "10px" }}
                    >
                      Drag
                    </Button>
                  ),
                })}
              </span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div className="text-right mt-2">
                <Button
                  icon={<MdDelete />}
                  type="primary"
                  danger
                  onClick={() => {
                    setFileList([]);
                  }}
                >
                  {t("chat-log.delete-all")}
                </Button>
              </div>
              <div className="grid gap-x-14 gap-y-10 m-auto mt-4 992:grid-cols-2 ">
                <SortableContext items={chatLogImages} strategy={rectSortingStrategy}>
                  {chatLogImages &&
                    chatLogImages.map((image, index) => {
                      return (
                        <>
                          <ImageInformation
                            fileList={fileList}
                            setFileList={setFileList}
                            id={image.id}
                            image={image}
                            key={image.id}
                            index={index}
                          />
                        </>
                      );
                    })}
                </SortableContext>
              </div>
            </DndContext>
          </div>
        ) : (
          <div className="h-screen flex flex-col justify-center items-center mt-4">
            <div className="w-[100%] lg:w-[85%] 2xl:w-[60%] h-screen">
              <h1 className="font-bold text-2xl py-2"> {t("chat-log.demo-title")}</h1>
              {isMobile || isTablet ? (
                <div className="lg:flex gap-5 ">
                  <Image
                    src="/demo-chat-log/chatLog.jpg"
                    alt="demo chat log"
                    preview={false}
                    className="lg:border"
                  ></Image>
                  <Image
                    src="/demo-chat-log/billLog.jpg"
                    alt="demo bill transaction"
                    preview={false}
                    className="lg:border"
                  ></Image>
                </div>
              ) : (
                <iframe src="/chatLogExample.pdf" className="w-full h-full border-none"></iframe>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-[50%]">
        <ChatLogPdfSetting isShowModal={isShowModal} setIsShowModal={setIsShowModal} />
      </div>
    </>
  );
};

export default ChatLog;
