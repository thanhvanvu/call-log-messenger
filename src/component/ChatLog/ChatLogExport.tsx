"use client";
import React, { useEffect, useState } from "react";
import { useCurrentApp } from "@/context/app.context";
import { Image } from "antd";

interface IProps {
  contentRef: any;
  chatLogPdfSetting: {
    title: boolean;
    titleContent: string;
    titleColor: string;
    backgroundColor: string;
  };
}

const ChatLogExport = (props: IProps) => {
  const { contentRef, chatLogPdfSetting } = props;
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
      <div className="w-[8.5in] mx-auto bg-white chatLogPrintPage" ref={contentRef}>
        {chatLogPdfSetting?.title && (
          <h1
            className="text-xl font-bold text-center border"
            style={{
              backgroundColor: chatLogPdfSetting.backgroundColor,
              color: chatLogPdfSetting.titleColor,
            }}
          >
            {chatLogPdfSetting.titleContent}
          </h1>
        )}

        {chatLogExport &&
          chatLogExport.length > 0 &&
          chatLogExport.map((pageChatLog: IChatLog[], index: number) => {
            return (
              <div
                className={`grid grid-cols-3 justify-items-center gap-y-5  ${
                  index >= 1 ? "pt-10" : "mt-4"
                } `}
                key={index}
              >
                {pageChatLog.map((chatLog: IChatLog, index: number) => {
                  return (
                    <>
                      <div key={index} className={`flex flex-col justify-center items-center`}>
                        <Image
                          alt=""
                          src={chatLog.imageUrl}
                          width={210}
                          className="border border-black p-[1px]"
                        />

                        <p className="text-center">{chatLog.note ? chatLog.note : "\u00A0"}</p>
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

export default ChatLogExport;
