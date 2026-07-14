import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "../../pages/app-shell/page";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
