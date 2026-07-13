import { createRouter } from "@tanstack/react-router";
import { webBasePath } from "./config/web-path";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    basepath: webBasePath,
    defaultPreload: "intent",
    routeTree,
    scrollRestoration: true,
  });
}
