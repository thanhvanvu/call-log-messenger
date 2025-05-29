import { Alert, Popover } from "antd";
import Image from "next/image";
import React from "react";
import changeLanguage from "public/change-language.gif";

const content = (
  <div>
    <Image alt="change language" src={changeLanguage} />
  </div>
);

const ErrorAnnouncement = () => {
  return (
    <Popover placement="bottom" content={content}>
      <Alert
        type="warning"
        showIcon
        closable
        description={
          <div className="text-justify">
            I have identified bugs that may occur when using the browser in languages other than
            English to process JSON file data. To ensure avoid potential issues, please set your
            browser language to <span className="font-bold">ENGLISH</span> as default. If you need
            more help, contact me{" "}
            <a
              href="https://m.me/nguyenanh4994"
              className="font-bold cursor-pointer"
              target="_blank"
            >
              here
            </a>{" "}
            !
          </div>
        }
      />
    </Popover>
  );
};

export default ErrorAnnouncement;
