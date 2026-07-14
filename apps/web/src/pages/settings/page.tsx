import { SharedPlaceholderPage } from "../shared-placeholder/page";
import type { SettingsSection } from "./search/type";

type SettingsPageProps = Readonly<{
  section?: SettingsSection;
}>;

export function SettingsPage({ section }: SettingsPageProps) {
  return (
    <SharedPlaceholderPage
      description="Settings routing and the active session game are connected."
      details={
        section === undefined
          ? "Settings, backup, and persistence are implemented in roadmap step 25."
          : `Requested section: ${section}. It will be expanded by roadmap step 25.`
      }
      pageCode="UI-PAGE-008"
      title="Settings"
    />
  );
}
