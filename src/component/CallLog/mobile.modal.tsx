import { Modal } from "antd";
import React from "react";
import Image from "next/image";
import { IoIosInformationCircle } from "react-icons/io";
import { useTranslations } from "next-intl";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function MobileModal(props: IProps) {
  const { open, setOpen } = props;
  const t = useTranslations();
  return (
    <div className="w-72">
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoIosInformationCircle className="text-[#5295ff] text-lg" />
            {t("mobile-modal.title")}
          </div>
        }
        style={{ top: 20 }}
        open={open}
        onOk={() => {
          setOpen(false);
          // Save data to sessionStorage
          sessionStorage.setItem("mobileModal", "false");
        }}
        onCancel={() => {
          setOpen(false);
          // Save data to sessionStorage
          sessionStorage.setItem("mobileModal", "false");
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{t("mobile-modal.line1")}</p>
        <p>{t("mobile-modal.line2")}</p>
        <div className="flex justify-around mt-4 mb-4">
          <div>
            <Image
              alt="how to enable desktop site on android browser"
              src="https://i.imgur.com/uHYzFH9.gif"
              height={325}
              width={150}
              objectFit="cover"
              className="h-[325px] w-auto object-cover border border-black"
            />
            <p className="text-center mt-2">Android browser.</p>
          </div>

          <div>
            <Image
              alt="how to enable desktop site on safari browser"
              src="https://i.imgur.com/Z9pnI4S.gif"
              height={325}
              width={150}
              className="h-[325px] w-auto object-cover border border-black"
            />
            <p className="text-center mt-2">Safari browser.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MobileModal;
