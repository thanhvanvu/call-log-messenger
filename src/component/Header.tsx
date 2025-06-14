"use client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import icon from "@/app/favicon.ico";
import Image from "next/image";
import { Button, Select } from "antd";
import { useParams } from "next/navigation";

import { Link, Locale, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useCurrentApp } from "@/context/app.context";
import { BrowserView, isBrowser } from "react-device-detect";
import newGif from "public/new-star.gif";

const Header = () => {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const { setLanguage } = useCurrentApp();

  const { guideTour, setGuideTour, tourStep } = useCurrentApp();
  const localeOption = [
    {
      value: "en",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-us"></span>
          <span className="hidden sm:block">English</span>
          <span className="block sm:hidden">EN</span>
        </div>
      ),
    },
    {
      value: "vi",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-vn"></span>
          <span className="hidden sm:block">Vietnamese</span>
          <span className="block sm:hidden">VI</span>
        </div>
      ),
    },
    {
      value: "es",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-es"></span>
          <span className="hidden sm:block">Spanish</span>
          <span className="block sm:hidden">ES</span>
        </div>
      ),
    },
    {
      value: "ph",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-ph"></span>
          <span className="hidden sm:block">Filipino</span>
          <span className="block sm:hidden">PH</span>
        </div>
      ),
    },
    {
      value: "in",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-in"></span>
          <span className="hidden sm:block">Hindi</span>
          <span className="block sm:hidden">IN</span>
        </div>
      ),
    },
    {
      value: "cn",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-cn"></span>
          <span className="hidden sm:block">Chinese</span>
          <span className="block sm:hidden">CN</span>
        </div>
      ),
    },
    {
      value: "fr",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-fr"></span>
          <span className="hidden sm:block">French</span>
          <span className="block sm:hidden">FR</span>
        </div>
      ),
    },
    {
      value: "sa",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-sa"></span>
          <span className="hidden sm:block">Arabic</span>
          <span className="block sm:hidden">SA</span>
        </div>
      ),
    },

    {
      value: "pt",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-pt"></span>
          <span className="hidden sm:block">Portuguese</span>
          <span className="block sm:hidden">PT</span>
        </div>
      ),
    },

    {
      value: "ru",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-ru"></span>
          <span className="hidden sm:block">Russian</span>
          <span className="block sm:hidden">RU</span>
        </div>
      ),
    },

    {
      value: "pk",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-pk"></span>
          <span className="hidden sm:block">Urdu</span>
          <span className="block sm:hidden">PK</span>
        </div>
      ),
    },
    {
      value: "it",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-it"></span>
          <span className="hidden sm:block">Italian</span>
          <span className="block sm:hidden">IT</span>
        </div>
      ),
    },
    {
      value: "de",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-de"></span>
          <span className="hidden sm:block">German</span>
          <span className="block sm:hidden">DE</span>
        </div>
      ),
    },
    {
      value: "nl",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-nl"></span>
          <span className="hidden sm:block">Dutch</span>
          <span className="block sm:hidden">NL</span>
        </div>
      ),
    },
    {
      value: "tr",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-tr"></span>
          <span className="hidden sm:block">Turkish</span>
          <span className="block sm:hidden">TR</span>
        </div>
      ),
    },
    {
      value: "jp",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-jp"></span>
          <span className="hidden sm:block">Japanese</span>
          <span className="block sm:hidden">JP</span>
        </div>
      ),
    },
    {
      value: "kr",
      label: (
        <div className="flex gap-2">
          <span className="fi fi-kr"></span>
          <span className="hidden sm:block">Korean</span>
          <span className="block sm:hidden">KR</span>
        </div>
      ),
    },
  ];

  const pathname = usePathname();

  const handleChange = (value: string) => {
    console.log(value);
    setLanguage(value);

    // Save data to sessionStorage
    localStorage.setItem("language", value);

    // @ts-ignore
    router.replace({ pathname, params }, { locale: value as Locale });
  };
  return (
    <div className="bg-body-tertiary">
      <Navbar collapseOnSelect expand="lg" className=" w-[90%] mx-auto justify-between 3xl:w-[80%]">
        <Link href="/" className="navbar-brand font-bold flex gap-2">
          <Image src={icon} alt="icon call tracker" width={30} height={30}></Image>
          Call-Tracker
        </Link>
        <div className="flex flex-row gap-2">
          <div className="flex-end sm:hidden">
            <Select
              listHeight={1000}
              listItemHeight={30}
              popupMatchSelectWidth={false}
              defaultValue={locale}
              style={{ width: 80 }}
              onChange={handleChange}
              options={localeOption}
            />
          </div>
          <div className="hidden sm:block 992:hidden">
            <Select
              listHeight={1000}
              listItemHeight={30}
              popupMatchSelectWidth={false}
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
            <div className="py-2  992:mx-8 font-bold">
              <div className="relative w-fit">
                <span className="absolute right-[-30px] top-[-20px]">
                  <Image src={newGif} alt="new gif icon" width={50}></Image>
                </span>
                <Link href="/chat-log" className="nav-link focus:text-[#0866FF]">
                  Chat Log Generator
                </Link>
              </div>
            </div>

            <div className="py-2 font-bold 992:mx-10">
              <Link href="/calllog" className="nav-link focus:text-[#0866FF]">
                Call Log Generator
              </Link>
            </div>

            <div className="py-2 font-bold" ref={tourStep?.step1}>
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
          <div ref={tourStep?.step7}>
            <Select
              listHeight={1000}
              listItemHeight={20}
              defaultValue={locale}
              style={{ width: 140 }}
              onChange={handleChange}
              options={localeOption}
              className="border-none"
            />
          </div>

          {pathname === "/calllog" ? (
            <BrowserView>
              <Button
                type="primary"
                size="large"
                onClickCapture={() => {
                  setGuideTour(!guideTour);
                }}
              >
                {t("guide-tour.button")}
              </Button>
            </BrowserView>
          ) : (
            <></>
          )}
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
