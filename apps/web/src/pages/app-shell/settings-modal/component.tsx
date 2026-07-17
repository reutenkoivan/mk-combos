import { BackupCollapsibleBlock } from "@mk-combos/ui/components/backup-collapsible-block";
import { DisplayModeSwitcher } from "@mk-combos/ui/components/display-mode-switcher";
import { LanguageSwitcher } from "@mk-combos/ui/components/language-switcher";
import { NotationLegendTable } from "@mk-combos/ui/components/notation-legend-table";
import { ThemePreferenceSwitcher } from "@mk-combos/ui/components/theme-preference-switcher";
import { XIcon } from "@mk-combos/ui/icons/x";
import { IconButton } from "@mk-combos/ui/primitives/button";
import { Show } from "@mk-combos/ui/primitives/conditional";
import {
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport,
} from "@mk-combos/ui/primitives/dialog";
import { StatusMessage } from "@mk-combos/ui/primitives/state";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from "@mk-combos/ui/primitives/tabs";
import { uiToneModes } from "@mk-combos/ui/tokens/value";
import { useBlocker } from "@tanstack/react-router";

import { useSettingsController } from "./controller/hook";
import { useSettingsForm } from "./form/hook";
import { useSettingsGameBackup } from "./game-backup/hook";
import { useSettingsNavigation } from "./navigation/hook";
import type { SettingsTab } from "./navigation/type";
import { settingsTabs } from "./navigation/value";

type SettingsModalProps = Readonly<{
  open: boolean;
  section: SettingsTab;
}>;

export function SettingsModal({ open, section }: SettingsModalProps) {
  const form = useSettingsForm();
  const backup = useSettingsGameBackup({ copy: form.copy.backup, section });
  const navigation = useSettingsNavigation();
  const controller = useSettingsController({
    activeSection: section,
    backup,
    copy: form.copy,
    displayModeSwitcher: form.displayModeSwitcher,
    languageSwitcher: form.languageSwitcher,
    navigation: {
      closeLabel: form.copy.settings.close,
      closeSettings: navigation.closeSettings,
      selectSection: navigation.selectSection,
    },
    open,
    themePreferenceSwitcher: form.themePreferenceSwitcher,
  });

  useBlocker({
    disabled: !open || !backup.operationActive,
    enableBeforeUnload: open && backup.operationActive,
    shouldBlockFn: () => true,
  });

  return (
    <DialogRoot
      open={open}
      disablePointerDismissal={backup.operationActive}
      sourceFocusTarget="app-shell-global-menu"
      onOpenChange={({ open: nextOpen }) => {
        if (!nextOpen && !backup.operationActive) {
          navigation.closeSettings();
        }
      }}
    >
      <DialogPortal>
        <DialogBackdrop className="bg-black/50 backdrop-blur-[4px]" />
        <DialogViewport className="data-[ui-dialog-placement=mobile]:p-0 data-[ui-dialog-placement=tablet]:p-0">
          <DialogPopup
            data-ui-page="UI-PAGE-008"
            finalFocus={() =>
              document.querySelector<HTMLElement>('[data-ui-focus-target="app-shell-global-menu"]')
            }
            className="w-full max-w-5xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden outline outline-1 outline-black/10 data-[ui-dialog-placement=desktop]:h-[min(40rem,calc(100dvh-2rem))] data-[ui-dialog-placement=mobile]:h-dvh data-[ui-dialog-placement=mobile]:max-h-dvh data-[ui-dialog-placement=mobile]:max-w-none data-[ui-dialog-placement=mobile]:rounded-none data-[ui-dialog-placement=mobile]:pt-[max(1rem,env(safe-area-inset-top))] data-[ui-dialog-placement=tablet]:h-dvh data-[ui-dialog-placement=tablet]:max-h-dvh data-[ui-dialog-placement=tablet]:max-w-none data-[ui-dialog-placement=tablet]:rounded-none data-[ui-dialog-placement=tablet]:pt-[max(1rem,env(safe-area-inset-top))]"
          >
            <header className="flex min-w-0 items-start justify-between gap-4 border-b border-(--ui-separator) pb-3">
              <div className="grid min-w-0 gap-1">
                <DialogTitle className="font-(--ui-font-display) text-2xl font-semibold tracking-[-0.01em]">
                  {form.copy.settings.title}
                </DialogTitle>
                <DialogDescription className="max-w-2xl">
                  {form.copy.settings.description}
                </DialogDescription>
              </div>
              <IconButton
                {...controller.closeFocusProps}
                disabled={backup.operationActive}
                label={form.copy.settings.close}
                onRequestPress={navigation.closeSettings}
              >
                <XIcon aria-hidden="true" size="small" />
              </IconButton>
            </header>

            <div className="grid min-h-0 gap-6 overflow-y-auto overscroll-contain pt-4">
              <TabsRoot
                className="h-full grid-rows-[auto_minmax(0,1fr)]"
                value={section}
                onValueChange={({ value }) => navigation.selectSection(value)}
              >
                <TabsList aria-label={form.copy.settings.sectionsLabel}>
                  <TabsTab
                    {...controller.tabInterfaceFocusProps}
                    value={settingsTabs.interface}
                    disabled={backup.operationActive}
                  >
                    {form.copy.settings.interfaceTab}
                  </TabsTab>
                  <TabsTab
                    {...controller.tabBackupFocusProps}
                    value={settingsTabs.backup}
                    disabled={backup.operationActive}
                  >
                    {form.copy.settings.backupTab}
                  </TabsTab>
                </TabsList>

                <TabsPanel className="min-h-0" value={settingsTabs.interface}>
                  <section
                    aria-labelledby="settings-interface-title"
                    className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-5"
                  >
                    <header className="grid max-w-2xl gap-1">
                      <h2
                        id="settings-interface-title"
                        className="font-(--ui-font-display) text-lg font-semibold tracking-[-0.01em]"
                      >
                        {form.copy.settings.interfaceTab}
                      </h2>
                      <p className="text-sm text-(--ui-muted-text)">
                        {form.copy.settings.interfaceDescription}
                      </p>
                      <p className="text-xs text-(--ui-muted-text)">
                        {form.copy.settings.autosave}
                      </p>
                    </header>

                    <div className="grid min-h-0 min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] lg:items-stretch">
                      <div className="grid min-w-0 grid-rows-3 gap-1 rounded-(--ui-radius-surface) border border-(--ui-separator) bg-(--ui-toolbar) px-4 [&>*:first-child]:border-t-0">
                        <ThemePreferenceSwitcher
                          {...form.themePreferenceSwitcher}
                          {...controller.themePreferenceSwitcherFocusProps}
                          disabled={backup.operationActive}
                        />
                        <LanguageSwitcher
                          {...form.languageSwitcher}
                          {...controller.languageSwitcherFocusProps}
                          disabled={backup.operationActive}
                        />
                        <DisplayModeSwitcher
                          {...form.displayModeSwitcher}
                          {...controller.displayModeSwitcherFocusProps}
                          disabled={backup.operationActive}
                        />
                      </div>
                      <div className="flex min-w-0 items-center rounded-(--ui-radius-surface) border border-(--ui-separator) bg-(--ui-toolbar) px-4 [&>[data-ui-component=UI-CMP-037]]:w-full [&>[data-ui-component=UI-CMP-037]]:border-t-0">
                        <NotationLegendTable {...form.notationLegend} />
                      </div>
                    </div>
                  </section>
                </TabsPanel>

                <TabsPanel className="min-h-0" value={settingsTabs.backup}>
                  <section
                    aria-labelledby="settings-backup-title"
                    className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3"
                  >
                    <header className="grid max-w-2xl gap-1">
                      <h2
                        id="settings-backup-title"
                        className="font-(--ui-font-display) text-lg font-semibold tracking-[-0.01em]"
                      >
                        {form.copy.settings.backupTab}
                      </h2>
                      <p className="text-sm text-(--ui-muted-text)">
                        {form.copy.settings.backupDescription}
                      </p>
                    </header>
                    <div className="grid min-h-0 content-start gap-1 overflow-y-auto rounded-(--ui-radius-surface) border border-(--ui-separator) bg-(--ui-toolbar) px-4">
                      {backup.blocks.map((block) => (
                        <BackupCollapsibleBlock
                          {...block.props}
                          key={block.gameId}
                          controllerFocusedAction={controller.backupFocusedAction(block.gameId)}
                          exportDialog={
                            block.props.exportDialog
                              ? {
                                  ...block.props.exportDialog,
                                  controllerFocusedAction: controller.exportDialogFocusedAction,
                                }
                              : undefined
                          }
                          importPreviewDialog={
                            block.props.importPreviewDialog
                              ? {
                                  ...block.props.importPreviewDialog,
                                  controllerFocusedAction: controller.importDialogFocusedAction,
                                }
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </section>
                </TabsPanel>
              </TabsRoot>

              <input {...backup.fileInput} hidden type="file" />

              <Show when={Boolean(form.status)}>
                {() => (
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
              </Show>
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
}

SettingsModal.displayName = "SettingsModal";
