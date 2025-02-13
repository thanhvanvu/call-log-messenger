"use client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import icon from "@/app/favicon.ico";
import Image from "next/image";
import { Button, Select } from "antd";
import { useParams } from "next/navigation";

import { Link, Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const Header = () => {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();

  const localeOption = [
    {
      value: "en",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-us"></span>
          <span>English</span>
        </div>
      ),
    },
    {
      value: "vi",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-vn"></span>
          <span>Tiếng Việt</span>
        </div>
      ),
    },
    {
      value: "es",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-es"></span>
          <span>Spanish</span>
        </div>
      ),
    },
    {
      value: "cn",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-cn"></span>
          <span>Chinese</span>
        </div>
      ),
    },
    {
      value: "in",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-in"></span>
          <span>Hindi</span>
        </div>
      ),
    },

    {
      value: "fr",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-fr"></span>
          <span>French </span>
        </div>
      ),
    },
    {
      value: "sa",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-sa"></span>
          <span>Arabic</span>
        </div>
      ),
    },

    {
      value: "pt",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-pt"></span>
          <span>Portuguese</span>
        </div>
      ),
    },

    {
      value: "ru",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-ru"></span>
          <span>Russian</span>
        </div>
      ),
    },

    {
      value: "pk",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-pk"></span>
          <span>Pakistan</span>
        </div>
      ),
    },
  ];

  const pathname = usePathname();

  const handleChange = (value: string) => {
    // @ts-ignore
    router.replace({ pathname, params }, { locale: value as Locale });
  };

  return (
    <div className="bg-body-tertiary">
      <Navbar collapseOnSelect expand="lg" className=" w-[90%] mx-auto justify-between 3xl:w-[80%]">
        <Link href="/" className="navbar-brand font-bold flex gap-2">
          <Image src={icon} alt="" width={30} height={30}></Image>
          Call-Logs
        </Link>
        <div className="flex flex-row gap-2">
          <div className="flex-end 992:hidden">
            <Select
              defaultValue={locale}
              style={{ width: 140 }}
              onChange={handleChange}
              options={localeOption}
            />
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </div>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto ">
            <div className="py-2">
              <Link href="/guide" className="nav-link focus:text-[#0866FF]">
                {t("header.guide")}
              </Link>
            </div>

            <span className=" py-1 border px-4 rounded-xl bg-[#0866FF] w-fit 992:hidden mt-2">
              <Link href="/calllog" className="nav-link text-white  ">
                {t("header.get-started")}
              </Link>
            </span>
          </Nav>
        </Navbar.Collapse>

        <div className=" hidden 992:flex flex-row items-center gap-4">
          <Select
            defaultValue={locale}
            style={{ width: 140 }}
            onChange={handleChange}
            options={localeOption}
            className="border-none"
          />
          <Link href={"/calllog"}>
            <Button type="primary" size="large">
              {t("header.get-started")}
            </Button>
          </Link>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
