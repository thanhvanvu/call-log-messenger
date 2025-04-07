"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import picture from "../../public/combined_stylized.jpg";
import { Button } from "antd";
import MobileModal from "./CallLog/mobile.modal";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DownloadOutlined } from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import { RiGuideFill } from "react-icons/ri";
import { BsArrowRight } from "react-icons/bs";
import demoPDF from "public/Call-logs.pdf";

function Homepage() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const t = useTranslations();
  // Check screen size
  useEffect(() => {
    const handleSetMobileModal = () => {
      // Get saved data from sessionStorage
      const data = sessionStorage.getItem("mobileModal");

      if (!data) {
        if (window.innerWidth < 1280) {
          setIsOpenModal(true);
          // Save data to sessionStorage
          sessionStorage.setItem("mobileModal", "true");
        } else {
          setIsOpenModal(false);
          // Save data to sessionStorage
          sessionStorage.setItem("mobileModal", "false");
        }
      } else {
        setIsOpenModal(data === "true" ? true : false);
      }
    };

    // Initial check
    handleSetMobileModal();

    // Listen to resize events
    window.addEventListener("resize", handleSetMobileModal);

    // Clean up event listener
    return () => window.removeEventListener("resize", handleSetMobileModal);
  }, []);

  return (
    <div className="w-[90%]  mx-auto mt-4 3xl:w-[70%] 3xl:flex gap-20">
      {/* Render the MobileModal only on screens smaller than 3xl */}
      <MobileModal open={isOpenModal} setOpen={setIsOpenModal} />

      <div className="3xl:mt-[150px] 3xl:w-[60%]">
        <h1 className="text-4xl font-bold 3xl:text-6xl">
          {t.rich("homepage.title", {
            callLogs: (chunk) => <span className="text-[#0866ff]">{chunk}</span>,
          })}
        </h1>
        <p className="mt-4">{t("homepage.description")}</p>
        <div className="mt-4 gap-4 flex flex-col sm:flex-row sm:gap-5 xl:w-[70%] 3xl:w-full">
          <Link href={"/calllog"}>
            <Button className="shadow-sm w-full sm:min-w-[250px]" type="primary" size="large">
              {t("common.get-started")}
              <BsArrowRight />
            </Button>
          </Link>

          <Button
            icon={<FaFilePdf />}
            className="shadow-sm w-full sm:min-w-[250px]"
            type="primary"
            size="large"
            danger
          >
            <a href="/Call-logs.pdf" target="_blank">
              {t("common.demo-pdf")}
            </a>
          </Button>
        </div>
        <div className="mt-4 gap-4 flex flex-col sm:flex-row sm:gap-5 xl:w-[70%] 3xl:w-full">
          <Link href={"/guide"}>
            <Button
              className="shadow-sm w-full sm:min-w-[250px]"
              variant="solid"
              size="large"
              icon={<RiGuideFill />}
            >
              {t("common.guide")}
            </Button>
          </Link>

          <Button
            icon={<DownloadOutlined />}
            className="shadow-sm w-full sm:min-w-[250px]"
            type="dashed"
            size="large"
          >
            <a href="/message_1.json" download="message_1">
              {t("common.demo-json")}
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <Image src={picture} alt="" className="shadow-lg" />
      </div>
    </div>
  );
}

export default Homepage;
