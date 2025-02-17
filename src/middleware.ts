import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en|es|cn|in|fr|sa|pt|ru|pk|it|de|nl|tr|jp|ko)/:path*"],
};
