import { FirstLaunchSetupForm } from "@mk-combos/ui/components/first-launch-setup-form";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { Show } from "@mk-combos/ui/primitives/conditional";
import { LoadingIndicator } from "@mk-combos/ui/primitives/state";

import { useFirstLaunchSetup } from "./setup/hook";

export function FirstLaunchPage() {
  const setup = useFirstLaunchSetup();
  const desktop = setup.responsiveMode === uiResponsiveModes.desktop;
  const mobile = setup.responsiveMode === uiResponsiveModes.mobile;

  return (
    <main
      data-ui-page="UI-PAGE-002"
      className={`grid min-h-full content-start justify-items-center bg-(--ui-window) text-(--ui-text) ${mobile ? "p-4" : "p-6"}`}
    >
      <Show fallback={() => <LoadingIndicator label={setup.copy.title} />} when={setup.showSetup}>
        {() => (
          <div
            className={`grid w-full max-w-5xl items-start ${desktop ? "grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 py-6" : "gap-8"}`}
          >
            <div className="grid min-w-0 gap-8">
              <header className="grid gap-3 border-s-4 border-(--ui-accent) py-1 ps-4">
                <h1 className="font-(--ui-font-display) text-3xl font-semibold tracking-[-0.025em]">
                  {setup.copy.title}
                </h1>
                <p className="max-w-xl text-base leading-6 text-(--ui-muted-text)">
                  {setup.copy.description}
                </p>
              </header>

              <section aria-labelledby="first-launch-capabilities-title" className="grid gap-4">
                <h2 className="text-sm font-semibold" id="first-launch-capabilities-title">
                  {setup.copy.capabilitiesIntro}
                </h2>
                <ol className="grid gap-3 text-sm text-(--ui-muted-text)">
                  {setup.copy.capabilities.map((capability, index) => (
                    <li
                      key={capability}
                      className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-7 place-items-center rounded-full bg-(--ui-selection-muted) font-semibold text-(--ui-accent-strong)"
                      >
                        {index + 1}
                      </span>
                      <span className="self-center leading-5">{capability}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <p className="border-s-2 border-(--ui-separator) ps-4 text-sm leading-5 text-(--ui-muted-text)">
                {setup.copy.dataNotice}
              </p>
            </div>

            <div
              className={
                desktop
                  ? "min-w-0 border-s border-(--ui-separator) ps-10"
                  : "min-w-0 border-t border-(--ui-separator) pt-8"
              }
            >
              <FirstLaunchSetupForm {...setup.formProps} />
            </div>
          </div>
        )}
      </Show>
    </main>
  );
}

FirstLaunchPage.displayName = "FirstLaunchPage";
