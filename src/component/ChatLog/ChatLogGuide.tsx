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
      label: t("chat-log.upload-guide-desktop.title"),
      children: (
        <div>
          <ul className="992:list-disc list-inside  text-gray-700 mt-2 flex flex-col gap-3">
            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step1.step")}
                  </span>{" "}
                  {t("chat-log.upload-guide-desktop.step1.content")}
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
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step2.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-desktop.step2.content", {
                    icon: (chunk) => (
                      <InboxOutlined className="text-2xl mx-2" style={{ color: "#2196F3" }} />
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step3.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-desktop.step3.content", {
                    icon: (chunk) => (
                      <Button
                        type="primary"
                        icon={<RiDragMove2Fill className="" />}
                        size="small"
                        className="mx-2"
                      >
                        Drag
                      </Button>
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step4.step")}
                  </span>
                  {t("chat-log.upload-guide-desktop.step4.content")}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step5.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-desktop.step5.content", {
                    icon: (chunk) => (
                      <Button danger color="danger" size="small" className="mx-2">
                        <SettingOutlined />
                        {t("common.export-pdf.button")}
                      </Button>
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-desktop.step6.step")}
                  </span>
                  {t("chat-log.upload-guide-desktop.step6.content")}
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
      label: t("chat-log.upload-guide-mobile.title"),
      children: (
        <div>
          <ul className="992:list-disc list-inside  text-gray-700 mt-2 flex flex-col gap-3">
            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step1.step")}
                  </span>{" "}
                  {t("chat-log.upload-guide-mobile.step1.content")}
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
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step2.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-mobile.step2.content", {
                    icon: (chunk) => (
                      <InboxOutlined className="text-2xl mx-2" style={{ color: "#2196F3" }} />
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step3.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-mobile.step3.content", {
                    icon: (chunk) => (
                      <Button
                        type="primary"
                        icon={<RiDragMove2Fill className="" />}
                        size="small"
                        className="mx-2"
                      >
                        Drag
                      </Button>
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step4.step")}
                  </span>
                  {t("chat-log.upload-guide-mobile.step4.content")}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step5.step")}
                  </span>
                  {t.rich("chat-log.upload-guide-mobile.step5.content", {
                    icon: (chunk) => (
                      <Button danger color="danger" size="small" className="mx-2">
                        <SettingOutlined />
                        {t("common.export-pdf.button")}
                      </Button>
                    ),
                  })}
                </p>
              </div>
            </li>

            <li>
              <div className="inline-block">
                <p className="">
                  <span className="font-bold underline mr-2">
                    {t("chat-log.upload-guide-mobile.step6.step")}
                  </span>
                  {t("chat-log.upload-guide-mobile.step6.content")}
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
