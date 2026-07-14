import { createFileRoute } from "@tanstack/react-router";
import { RouteRecoveryPage } from "../../app/route-placeholder";

export const Route = createFileRoute("/_app/$")({
  component: RouteRecoveryPage,
});
