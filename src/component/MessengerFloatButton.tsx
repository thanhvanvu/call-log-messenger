"use client";
import { FloatButton, Popover } from "antd";
import React, { useState } from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

const MessengerFloatButton = () => {
  const [floatButton, setFloatButton] = useState<boolean>(true);
  const content = (
    <div
      className="text-white cursor-pointer"
      onClick={() => {
        setFloatButton(false);
      }}
    >
      <span className="flex justify-end ">
        <IoMdCloseCircleOutline style={{ fontSize: "20px" }} />
      </span>
      <p>
        Need help ? <br></br> Chat with me here !
      </p>
    </div>
  );
  return (
    <div>
      <Popover content={content} open={floatButton} placement="topLeft" color="rgb(87,87,87)">
        <FloatButton
          type="primary"
          href="https://m.me/nguyenanh4994"
          target="_blank"
          className="messenger-float-button"
          style={{ insetInlineEnd: 30, width: "60px", height: "60px" }}
          icon={<FaFacebookMessenger style={{ fontSize: "30px" }} />}
        />
      </Popover>
      ;
    </div>
  );
};

export default MessengerFloatButton;
