import { Modal } from "antd";
import React from "react";
import Image from "next/image";
import { IoIosInformationCircle, IoIosWarning } from "react-icons/io";

import { useTranslations } from "next-intl";
interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
// onOk={handleOk} onCancel={handleCancel}
function PdfWarningModal(props: IProps) {
  const { open, setOpen } = props;
  const t = useTranslations();
  return (
    <div className="w-72">
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoIosWarning className="text-[orange]" />
            {t("pdf-warning.title")}
          </div>
        }
        style={{ top: 20 }}
        open={open}
        onOk={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <ul className="list-disc list-inside mt-3">
          <li>{t("pdf-warning.line1")}</li>
          <li>{t("pdf-warning.line2")}</li>
          <li>{t("pdf-warning.line3")}</li>
        </ul>

        <div className="flex justify-around mt-4 mb-4 shadow-sm">
          <div>
            <Image
              alt=""
              src="https://i.imgur.com/iK8CcPs.gif"
              height={250}
              width={100}
              className="w-auto object-fill "
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PdfWarningModal;
