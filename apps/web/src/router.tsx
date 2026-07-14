import { createHashHistory, createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { webBasePath, webRouterBasePath } from "./routing/web-path/value";

type GetRouterOptions = Readonly<{
  history?: RouterHistory;
}>;

const webDocumentBasePath = webBasePath.slice(0, -1);
export const webDocumentRewrite = {
  input: ({ url }: { url: URL }) => {
    if (url.pathname === webDocumentBasePath) {
      url.pathname = "/";
    } else if (url.pathname.startsWith(`${webDocumentBasePath}/`)) {
      url.pathname = url.pathname.slice(webDocumentBasePath.length);
    }

    return url;
  },
  output: ({ url }: { url: URL }) => {
    url.pathname = `${webDocumentBasePath}${url.pathname}`;

    return url;
  },
};

export function getRouter(options: GetRouterOptions = {}) {
  return createRouter({
    basepath: webRouterBasePath,
    defaultPreload: "intent",
    history: options.history ?? (typeof window === "undefined" ? undefined : createHashHistory()),
    rewrite:
      typeof window === "undefined" && import.meta.env.BASE_URL === webBasePath
        ? webDocumentRewrite
        : undefined,
    routeTree,
    scrollRestoration: true,
  });
}
