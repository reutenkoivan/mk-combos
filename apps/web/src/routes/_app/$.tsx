import { createFileRoute } from "@tanstack/react-router";
import { RouteRecoveryPage } from "../../pages/route-recovery/page";

export const Route = createFileRoute("/_app/$")({
  component: RouteRecoveryPage,
});
