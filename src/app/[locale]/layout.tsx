import "./globals.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import Header from "@/component/Header";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppProvider from "@/context/app.context";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { ConfigProvider, theme } from "antd";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Call Logs & Stats - Export, Analyze, and Track",
  description:
    "Easily manage, analyze, and export call logs in a designed PDF format, supporting over 10 languages.",
  keywords: [
    "call logs",
    "call statistics",
    "communication tracking",
    "call management",
    "analytics",
    "PDF export",
    "multilingual support",
  ],
  openGraph: {
    title: "Call Logs & Stats - Export, Analyze, and Track",
    description:
      "Easily manage, analyze, and export call logs in a designed PDF format, supporting over 10 languages.",
    url: "https://call-log-messenger.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/aK0TH1w.jpg",
        width: 1200,
        height: 630,
        alt: "Call logs and statistics dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Call Logs & Stats - Export, Analyze, and Track",
    description:
      "Easily manage, analyze, and export call logs in a designed PDF format, supporting over 10 languages.",
    images: ["https://i.imgur.com/mheSIaQ.jpg"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2196F3",
          colorBgBase: "#ffffff",
        },
      }}
    >
      <NextIntlClientProvider messages={messages}>
        <AppProvider>
          <html lang={locale}>
            <body className={inter.className}>
              <Header />
              <div className="">
                <AntdRegistry>{children}</AntdRegistry>
                <Analytics />
                <SpeedInsights />
              </div>
            </body>
          </html>
        </AppProvider>
      </NextIntlClientProvider>
    </ConfigProvider>
  );
}
