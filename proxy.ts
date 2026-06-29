import { NextResponse, type NextRequest } from "next/server";

const NEWS_LIST_TAB_PREFIX = "/news-activities-list-tab-";
const FAQ_TAB_PREFIX = "/faq-tab-";

const rewriteTabPath = (
  request: NextRequest,
  prefix: string,
  targetPath: string
) => {
  const { pathname } = request.nextUrl;
  const tabSlug = pathname.slice(prefix.length);
  const url = request.nextUrl.clone();

  url.pathname = targetPath;
  url.searchParams.set("tabSlug", tabSlug || "All");

  return NextResponse.rewrite(url);
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(NEWS_LIST_TAB_PREFIX)) {
    return rewriteTabPath(request, NEWS_LIST_TAB_PREFIX, "/news-activities-list");
  }

  if (pathname.startsWith(FAQ_TAB_PREFIX)) {
    return rewriteTabPath(request, FAQ_TAB_PREFIX, "/faq");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
