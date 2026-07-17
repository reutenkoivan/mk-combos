import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "../../pages/app-shell/page";
import { SettingsModalSearchSchema } from "../../pages/app-shell/settings-modal/search/schema";
import type { SettingsModalSearch } from "../../pages/app-shell/settings-modal/search/type";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  validateSearch: SettingsModalSearchSchema,
});

function AppLayout() {
  const settingsSearch: SettingsModalSearch = Route.useSearch();

  return (
    <AppShell settingsSearch={settingsSearch}>
      <Outlet />
    </AppShell>
  );
}
