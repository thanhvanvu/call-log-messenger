import { Button, Collapse, CollapseProps, Image } from "antd";
import React from "react";
import { RiDragMove2Fill } from "react-icons/ri";
import { InboxOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { isMobile } from "react-device-detect";

const ChatLogGuide = () => {
  const t = useTranslations();
  const itemsDesktop: CollapseProps["items"] = [
    {
      key: "1",
      label: "How to upload images",
      children: (
        <div>
          <ul className="992:list-disc list-inside  text-gray-700 mt-2 flex flex-col gap-3">
            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">Step 1:</span> Screenshot messenger
                  chat log from your mobile phone. Here are some perfect examples below.
                </p>
              </div>
              <div className="flex justify-center gap-5 mt-2 ">
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
                <p className="">
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
                <p className="">
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
                <p className="">
                  <span className="font-bold underline mr-2">Step 4:</span>
                  Add a note for each image if necessary.
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
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

  const itemsMobile: CollapseProps["items"] = [
    {
      key: "1",
      label: "How to upload images",
      children: (
        <div>
          <ul className="992:list-disc list-inside  text-gray-700 mt-2 flex flex-col gap-3">
            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">Step 1:</span> Screenshot messenger
                  chat log from your mobile phone. Here are some perfect examples below.
                </p>
              </div>
              <div className="flex justify-center gap-5 mt-2 ">
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
                <p className="">
                  <span className="font-bold underline mr-2">Step 2:</span>
                  Tap this
                  <InboxOutlined className="text-2xl mx-2" style={{ color: "#2196F3" }} /> in the
                  box above to upload your images.
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">Step 3:</span>
                  Tap and hold the
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
                <p className="">
                  <span className="font-bold underline mr-2">Step 4:</span>
                  Add a note for each image if necessary.
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">Step 5:</span>
                  Tap this
                  <Button danger color="danger" size="small" className="mx-2">
                    <SettingOutlined />
                    Export Image Setting
                  </Button>{" "}
                  button to export image.
                </p>
              </div>
            </li>
          </ul>
        </div>
      ),
    },
  ];
  return (
    <Collapse
      items={isMobile ? itemsMobile : itemsDesktop}
      className="w-[100%] lg:w-[85%] 2xl:w-[60%] 3xl:w-[40%]"
    />
  );
};

export default ChatLogGuide;
