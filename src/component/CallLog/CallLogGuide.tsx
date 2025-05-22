import { Button, Collapse, CollapseProps, Image } from "antd";
import React from "react";
import { RiDragMove2Fill } from "react-icons/ri";
import { InboxOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { isMobile } from "react-device-detect";

const CallLogGuide = () => {
  const t = useTranslations();
  const itemsDesktop: CollapseProps["items"] = [
    {
      key: "1",
      label: t("call-logs.guide-upload-json"),
      children: (
        <>
          <div className="relative w-4/5 mx-auto aspect-video shadow-md border">
            <iframe
              src="https://www.youtube.com/embed/goFfnTL5rVs"
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </>
      ),
    },
  ];
  return (
    <Collapse
      defaultActiveKey={[1]}
      items={itemsDesktop}
      className="w-[100%] lg:w-[85%] 2xl:w-[60%] 3xl:w-[40%]"
    />
  );
};

export default CallLogGuide;
