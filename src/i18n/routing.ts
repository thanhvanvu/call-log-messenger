import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "en",
    "vi",
    "es",
    "cn",
    "in",
    "fr",
    "sa",
    "pt",
    "ru",
    "pk",
    "it",
    "de",
    "nl",
    "tr",
    "jp",
    "ko",
  ],

  // Used when no locale matches
  defaultLocale: "en",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
