"use client";
import React, { useEffect, useState } from "react";
import { useCurrentApp } from "@/context/app.context";
import { Image } from "antd";

interface IProps {
  chatLogPdfSetting: {
    title: boolean;
    titleContent: string;
    titleColor: string;
    backgroundColor: string;
  };
}

const ChatLogExportMobile = (props: IProps) => {
  const { chatLogPdfSetting } = props;
  const { chatLogImages } = useCurrentApp();
  const [chatLogExport, setChatLogExport] = useState([]);

  useEffect(() => {
    let chatLogExport = [];
    for (let i = 0; i < chatLogImages.length; i += 6) {
      chatLogExport.push(chatLogImages.slice(i, i + 6));
    }

    setChatLogExport(chatLogExport as any);
  }, [chatLogImages]);
  return (
    <>
      <div className="mx-auto bg-white" id="element-to-capture" style={{ overflow: "visible" }}>
        {chatLogPdfSetting?.title ? (
          <h1
            className="text-xl font-bold border text-center h-[45px]"
            style={{
              backgroundColor: chatLogPdfSetting.backgroundColor,
              color: chatLogPdfSetting.titleColor,
            }}
          >
            {chatLogPdfSetting.titleContent}
          </h1>
        ) : (
          <h1 className=" h-[15px]"></h1>
        )}

        {chatLogExport &&
          chatLogExport.length > 0 &&
          chatLogExport.map((pageChatLog: IChatLog[], index: number) => {
            return (
              <div
                className={`grid grid-cols-3 justify-items-center gap-y-5 ${
                  index >= 1 ? "pt-10" : "mt-4"
                } pb-8`}
                key={index}
              >
                {pageChatLog.map((chatLog: IChatLog, index: number) => {
                  return (
                    <>
                      <div key={index} className={`flex flex-col justify-center items-center`}>
                        <Image
                          alt="mobile screenshot image"
                          src={chatLog.imageUrl}
                          width={210}
                          className="border"
                        />
                        <p className="text-center min-h-[24px] leading-snug break-words px-1">
                          {chatLog.note ? chatLog.note : "\u00A0"}
                        </p>
                      </div>
                    </>
                  );
                })}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ChatLogExportMobile;
