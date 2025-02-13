import { Modal } from "antd";
import React from "react";
import android from "public/android.gif";
import safari from "public/safari.gif";
import Image from "next/image";
import { useTranslations } from "next-intl";
interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
// onOk={handleOk} onCancel={handleCancel}
function MobileModal(props: IProps) {
  const { open, setOpen } = props;
  const t = useTranslations();
  return (
    <div className="w-72">
      <Modal
        title={t("mobile-modal.title")}
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
      >
        <p>{t("mobile-modal.line1")}</p>
        <p>{t("mobile-modal.line2")}</p>
        <div className="flex justify-around mt-4 mb-4">
          <div>
            <Image
              alt=""
              src={android}
              height={325}
              width={150}
              objectFit="cover"
              className="h-[325px] w-auto object-cover border border-black"
            />
            <p className="text-center mt-2">Android browser.</p>
          </div>

          <div>
            <Image
              alt=""
              src={safari}
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
