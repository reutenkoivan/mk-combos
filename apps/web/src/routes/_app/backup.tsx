import { createFileRoute, redirect } from "@tanstack/react-router";
import { settingsSections } from "../../pages/settings/search/value";

export const Route = createFileRoute("/_app/backup")({
  beforeLoad: () => {
    throw redirect({
      replace: true,
      search: { section: settingsSections.backup },
      to: "/settings",
    });
  },
});
