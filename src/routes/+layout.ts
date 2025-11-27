import { isValidLanguage, getDefaultLanguage } from "$lib/i18n";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, request }) => {
  const pathname = url.pathname;

  // 静的ファイル（favicon.icoなど）はスキップ
  if (
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return;
  }

  if (pathname === "/") {
    const headers = request?.headers;
    const defaultLang = getDefaultLanguage(headers);
    throw redirect(307, `/${defaultLang}`);
  }

  const lang = pathname.split("/")[1];

  if (!lang || !isValidLanguage(lang)) {
    const headers = request?.headers;
    const defaultLang = getDefaultLanguage(headers);
    throw redirect(307, `/${defaultLang}`);
  }
};
