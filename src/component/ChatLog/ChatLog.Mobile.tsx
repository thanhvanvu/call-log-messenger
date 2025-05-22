import { Alert, Image } from "antd";
import React from "react";

const ChatLogMobile = () => {
  return (
    <div className="mt-3 w-[90%] m-auto 3xl:w-[80%] pb-14">
      <Alert
        message="Warning"
        type="warning"
        showIcon
        description={
          <div className="text-justify">
            This feature is not available on mobile or tablet browsers. Please use a laptop or
            desktop computer for the best experience. Sorry for the inconvenience.
          </div>
        }
      />

      <div className="w-[100%] mt-4">
        <h1 className="font-bold text-2xl py-2">Demo Chat Logs PDF:</h1>
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
      </div>
    </div>
  );
};

export default ChatLogMobile;
