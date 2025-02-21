import { Metadata } from "next";

import HomePage from "@/component/HomePage";

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
        url: "https://i.imgur.com/mheSIaQ.jpg",
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

export default function Home() {
  return <HomePage />;
}
