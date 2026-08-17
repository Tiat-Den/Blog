import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["vi", "en"];
const defaultLocale = "vi";

// Get the preferred locale from headers or fallback
function getLocale(request: NextRequest): string {
  // Check if there is a specific cookie (optional, can implement later if needed)
  // Check Accept-Language
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // A simple parse, matching first preferred supported locale
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale;
      }
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip api, _next/static, _next/image, favicon.ico, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // e.g. .ico, .png
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
