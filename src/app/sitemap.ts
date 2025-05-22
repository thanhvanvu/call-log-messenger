import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://call-log-messenger.vercel.app",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://call-log-messenger.vercel.app/en",
          vi: "https://call-log-messenger.vercel.app/vi",
          es: "https://call-log-messenger.vercel.app/es",
          fr: "https://call-log-messenger.vercel.app/fr",
          sa: "https://call-log-messenger.vercel.app/sa",
          pt: "https://call-log-messenger.vercel.app/pt",
          ru: "https://call-log-messenger.vercel.app/ru",
          it: "https://call-log-messenger.vercel.app/it",
          de: "https://call-log-messenger.vercel.app/de",
          nl: "https://call-log-messenger.vercel.app/nl",
          tr: "https://call-log-messenger.vercel.app/tr",
          kr: "https://call-log-messenger.vercel.app/kr",
        },
      },
    },
    {
      url: "https://call-log-messenger.vercel.app/chat-log",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://call-log-messenger.vercel.app/en/chat-log",
          vi: "https://call-log-messenger.vercel.app/vi/chat-log",
          es: "https://call-log-messenger.vercel.app/es/chat-log",
          fr: "https://call-log-messenger.vercel.app/fr/chat-log",
          sa: "https://call-log-messenger.vercel.app/sa/chat-log",
          pt: "https://call-log-messenger.vercel.app/pt/chat-log",
          ru: "https://call-log-messenger.vercel.app/ru/chat-log",
          it: "https://call-log-messenger.vercel.app/it/chat-log",
          de: "https://call-log-messenger.vercel.app/de/chat-log",
          nl: "https://call-log-messenger.vercel.app/nl/chat-log",
          tr: "https://call-log-messenger.vercel.app/tr/chat-log",
          kr: "https://call-log-messenger.vercel.app/kr/chat-log",
        },
      },
    },
    {
      url: "https://call-log-messenger.vercel.app/calllog",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://call-log-messenger.vercel.app/en/calllog",
          vi: "https://call-log-messenger.vercel.app/vi/calllog",
          es: "https://call-log-messenger.vercel.app/es/calllog",
          fr: "https://call-log-messenger.vercel.app/fr/calllog",
          sa: "https://call-log-messenger.vercel.app/sa/calllog",
          pt: "https://call-log-messenger.vercel.app/pt/calllog",
          ru: "https://call-log-messenger.vercel.app/ru/calllog",
          it: "https://call-log-messenger.vercel.app/it/calllog",
          de: "https://call-log-messenger.vercel.app/de/calllog",
          nl: "https://call-log-messenger.vercel.app/nl/calllog",
          tr: "https://call-log-messenger.vercel.app/tr/calllog",
          kr: "https://call-log-messenger.vercel.app/kr/calllog",
        },
      },
    },
    {
      url: "https://call-log-messenger.vercel.app/guide",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://call-log-messenger.vercel.app/en/guide",
          vi: "https://call-log-messenger.vercel.app/vi/guide",
          es: "https://call-log-messenger.vercel.app/es/guide",
          fr: "https://call-log-messenger.vercel.app/fr/guide",
          sa: "https://call-log-messenger.vercel.app/sa/guide",
          pt: "https://call-log-messenger.vercel.app/pt/guide",
          ru: "https://call-log-messenger.vercel.app/ru/guide",
          it: "https://call-log-messenger.vercel.app/it/guide",
          de: "https://call-log-messenger.vercel.app/de/guide",
          nl: "https://call-log-messenger.vercel.app/nl/guide",
          tr: "https://call-log-messenger.vercel.app/tr/guide",
          kr: "https://call-log-messenger.vercel.app/kr/guide",
        },
      },
    },
  ];
}
