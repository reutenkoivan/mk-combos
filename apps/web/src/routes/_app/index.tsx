import { createFileRoute } from "@tanstack/react-router";
import { FirstLaunchPage } from "../../pages/first-launch/page";

export const Route = createFileRoute("/_app/")({
  component: FirstLaunchPage,
});
