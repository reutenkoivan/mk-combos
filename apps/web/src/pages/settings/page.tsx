import { BackupCollapsibleBlock } from "@mk-combos/ui/components/backup-collapsible-block";
import { DisplayModeSwitcher } from "@mk-combos/ui/components/display-mode-switcher";
import { LanguageSwitcher } from "@mk-combos/ui/components/language-switcher";
import { NotationLegendTable } from "@mk-combos/ui/components/notation-legend-table";
import { Button } from "@mk-combos/ui/primitives/button";
import { StatusMessage } from "@mk-combos/ui/primitives/state";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from "@mk-combos/ui/primitives/tabs";
import { uiToneModes } from "@mk-combos/ui/tokens/value";

import { useSettingsForm } from "./form/hook";
import { useSettingsGameBackup } from "./game-backup/hook";
import { useSettingsNavigation } from "./navigation/hook";
import { settingsTabs } from "./navigation/value";
import type { SettingsSection } from "./search/type";
import { settingsSections } from "./search/value";

type SettingsPageProps = Readonly<{
  section?: SettingsSection;
}>;

export function SettingsPage({ section }: SettingsPageProps) {
  const form = useSettingsForm();
  const backup = useSettingsGameBackup({ copy: form.copy.backup, section });
  const navigation = useSettingsNavigation(form.copy.settings);
  const activeSection =
    section === settingsSections.backup ? settingsTabs.backup : settingsTabs.interface;

  return (
    <main
      className="grid min-h-full content-start justify-items-center bg-(--ui-window) p-4 text-(--ui-text) sm:p-6"
      data-ui-page="UI-PAGE-008"
    >
      <div className="grid w-full max-w-5xl gap-6">
        <header className="grid gap-4 border-l-4 border-(--ui-accent) py-1 pl-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <h1 className="font-(--ui-font-display) text-2xl font-semibold tracking-[-0.01em]">
              {form.copy.settings.title}
            </h1>
            <p className="max-w-2xl text-sm text-(--ui-muted-text)">
              {form.copy.settings.description}
            </p>
          </div>
          <Button disabled={backup.operationActive} onRequestPress={navigation.returnFromSettings}>
            {navigation.returnLabel}
          </Button>
        </header>

        <TabsRoot
          onValueChange={({ value }) => navigation.selectSection(value)}
          value={activeSection}
        >
          <TabsList aria-label={form.copy.settings.sectionsLabel}>
            <TabsTab disabled={backup.operationActive} value={settingsTabs.interface}>
              {form.copy.settings.interfaceTab}
            </TabsTab>
            <TabsTab disabled={backup.operationActive} value={settingsTabs.backup}>
              {form.copy.settings.backupTab}
            </TabsTab>
          </TabsList>

          <TabsPanel value={settingsTabs.interface}>
            <section aria-labelledby="settings-interface-title" className="grid gap-5">
              <header className="grid max-w-2xl gap-1">
                <h2
                  className="font-(--ui-font-display) text-lg font-semibold tracking-[-0.01em]"
                  id="settings-interface-title"
                >
                  {form.copy.settings.interfaceTab}
                </h2>
                <p className="text-sm text-(--ui-muted-text)">
                  {form.copy.settings.interfaceDescription}
                </p>
                <p className="text-xs text-(--ui-muted-text)">{form.copy.settings.autosave}</p>
              </header>

              <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] lg:items-start">
                <div className="grid min-w-0 gap-1">
                  <LanguageSwitcher {...form.languageSwitcher} disabled={backup.operationActive} />
                  <DisplayModeSwitcher
                    {...form.displayModeSwitcher}
                    disabled={backup.operationActive}
                  />
                </div>
                <NotationLegendTable {...form.notationLegend} />
              </div>
            </section>
          </TabsPanel>

          <TabsPanel value={settingsTabs.backup}>
            <section aria-labelledby="settings-backup-title" className="grid gap-3">
              <header className="grid max-w-2xl gap-1">
                <h2
                  className="font-(--ui-font-display) text-lg font-semibold tracking-[-0.01em]"
                  id="settings-backup-title"
                >
                  {form.copy.settings.backupTab}
                </h2>
                <p className="text-sm text-(--ui-muted-text)">
                  {form.copy.settings.backupDescription}
                </p>
              </header>
              <div className="grid gap-1">
                {backup.blocks.map((block) => (
                  <BackupCollapsibleBlock key={block.gameId} {...block.props} />
                ))}
              </div>
            </section>
          </TabsPanel>
        </TabsRoot>

        <input {...backup.fileInput} hidden type="file" />

        {form.status && (
          <StatusMessage
            tone={
              form.persistenceError
                ? uiToneModes.destructive
                : form.sessionOnly
                  ? uiToneModes.warning
                  : uiToneModes.success
            }
          >
            {form.status}
          </StatusMessage>
        )}
      </div>
    </main>
  );
}

SettingsPage.displayName = "SettingsPage";
