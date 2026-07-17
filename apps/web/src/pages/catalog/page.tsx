import { ComboList } from "@mk-combos/ui/components/combo-list";
import {
  ComboListConfigModule,
  type ComboListConfigModuleProps,
} from "@mk-combos/ui/components/combo-list-config-module";
import {
  ErrorState,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import { FilterControlGroup } from "@mk-combos/ui/components/filter-control-group";
import { Present, type PresentContentProps, Show } from "@mk-combos/ui/primitives/conditional";
import { StatusMessage } from "@mk-combos/ui/primitives/state";
import { uiToneModes } from "@mk-combos/ui/tokens/value";
import { useEffect, useRef } from "react";

import { useCatalogState } from "./catalog-state/hook";
import type { CatalogSearch } from "./search/type";
import { catalogSelectorSteps, useCatalogSelectorState } from "./selector-state/hook";

const commandDeckBackground = {
  backgroundColor: "var(--ui-command-surface)",
  backgroundImage:
    "linear-gradient(var(--ui-command-grid) 1px, transparent 1px), linear-gradient(90deg, var(--ui-command-grid) 1px, transparent 1px)",
  backgroundSize: "4.5rem 4.5rem",
} as const;
const catalogCanvasInsetClassName = "p-2 min-[40rem]:p-3";

function CatalogSpecificationConfigContent({
  value,
}: PresentContentProps<ComboListConfigModuleProps>) {
  return <ComboListConfigModule {...value} />;
}

export function CatalogCharacterSelectionPage() {
  const selector = useCatalogSelectorState({ step: catalogSelectorSteps.character });

  return (
    <main
      data-ui-page="UI-PAGE-003"
      style={commandDeckBackground}
      data-catalog-route="character-selector"
      className={`min-h-full min-w-0 text-(--ui-text) ${catalogCanvasInsetClassName}`}
    >
      <Show when={selector.restoreFailed}>
        {() => (
          <div className="pb-2">
            <StatusMessage tone={uiToneModes.warning}>{selector.copy.restoreWarning}</StatusMessage>
          </div>
        )}
      </Show>
      <ComboListConfigModule {...selector.characterConfig} />
    </main>
  );
}

CatalogCharacterSelectionPage.displayName = "CatalogCharacterSelectionPage";

type CatalogSpecificationSelectionPageProps = Readonly<{
  characterSlug: string;
}>;

export function CatalogSpecificationSelectionPage({
  characterSlug,
}: CatalogSpecificationSelectionPageProps) {
  const selector = useCatalogSelectorState({
    characterSlug,
    step: catalogSelectorSteps.specification,
  });

  return (
    <main
      data-ui-page="UI-PAGE-003"
      style={commandDeckBackground}
      data-catalog-route="specification-selector"
      className={`min-h-full min-w-0 text-(--ui-text) ${catalogCanvasInsetClassName}`}
    >
      <Present
        value={selector.invalidCharacter ? undefined : selector.specificationConfig}
        fallback={
          <div className="grid min-h-[calc(100dvh-8rem)] w-full max-w-3xl place-items-center justify-self-center">
            <ErrorState
              errorToken="catalog-invalid-character"
              message={selector.copy.recoveryWarning}
              controllerFocusedActionId="choose-fighter"
              title={selector.copy.chooseCharacterTitle}
              severity={errorStateSeverities.recoverable}
              sourceSurface="catalog-specification-selector"
              onRequestAction={() => selector.navigateToRoot(true)}
              technicalReference={`catalog.character.${characterSlug}.invalid`}
              actions={[
                {
                  available: true,
                  id: "choose-fighter",
                  kind: errorStateActionKinds.fallback,
                  label: selector.copy.backToCharacter,
                },
              ]}
            />
          </div>
        }
      >
        {CatalogSpecificationConfigContent}
      </Present>
    </main>
  );
}

CatalogSpecificationSelectionPage.displayName = "CatalogSpecificationSelectionPage";

type CatalogPageProps = Readonly<{
  characterSlug: string;
  preservedSearch: CatalogSearch;
  search: CatalogSearch;
  specificationSlug: string;
}>;

export function CatalogPage({
  characterSlug,
  preservedSearch,
  search,
  specificationSlug,
}: CatalogPageProps) {
  const catalog = useCatalogState({ characterSlug, preservedSearch, search, specificationSlug });
  const filterDrawerRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const resultScrollerRef = useRef<HTMLElement>(null);
  const invalid = catalog.invalidCharacter || catalog.invalidSpecification;
  const focusedComboRef = catalog.list.items.find((item) => item.focused)?.summary.ref;
  const focusedComboKey = focusedComboRef
    ? `${focusedComboRef.source}:${focusedComboRef.comboId}`
    : undefined;

  useEffect(() => {
    if (catalog.filtersOpen || invalid || !focusedComboKey) {
      return;
    }

    const focusedCard = resultScrollerRef.current?.querySelector<HTMLElement>(
      '[data-controller-focused="true"]',
    );

    focusedCard?.scrollIntoView?.({ block: "nearest" });
  }, [catalog.filtersOpen, focusedComboKey, invalid]);

  return (
    <main
      data-ui-page="UI-PAGE-003"
      data-catalog-route="result"
      style={commandDeckBackground}
      className={
        invalid
          ? "grid min-h-full min-w-0 text-(--ui-text)"
          : "grid h-full min-h-0 min-w-0 grid-rows-[minmax(0,1fr)] overflow-hidden text-(--ui-text)"
      }
    >
      <Show
        when={!invalid}
        fallback={() => (
          <div className="grid min-h-[calc(100dvh-8rem)] w-full max-w-3xl place-items-center justify-self-center p-3">
            <ErrorState
              sourceSurface="catalog-result"
              message={catalog.copy.recoveryWarning}
              severity={errorStateSeverities.recoverable}
              controllerFocusedActionId={
                catalog.invalidCharacter ? "choose-fighter" : "choose-specification"
              }
              onRequestAction={
                catalog.invalidCharacter ? catalog.changeCharacter : catalog.changeSpecification
              }
              errorToken={
                catalog.invalidCharacter
                  ? "catalog-invalid-character"
                  : "catalog-invalid-specification"
              }
              title={
                catalog.invalidCharacter
                  ? catalog.copy.chooseCharacterTitle
                  : catalog.copy.chooseContextTitle
              }
              technicalReference={
                catalog.invalidCharacter
                  ? `catalog.character.${characterSlug}.invalid`
                  : `catalog.specification.${specificationSlug}.invalid`
              }
              actions={[
                {
                  available: true,
                  id: catalog.invalidCharacter ? "choose-fighter" : "choose-specification",
                  kind: errorStateActionKinds.fallback,
                  label: catalog.invalidCharacter
                    ? catalog.copy.backToCharacter
                    : catalog.copy.chooseContextTitle,
                },
              ]}
            />
          </div>
        )}
      >
        {() => (
          <div
            data-catalog-result-layout
            className={`grid h-full min-h-0 w-full min-w-0 max-w-[95rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden justify-self-center ${catalogCanvasInsetClassName}`}
          >
            <h1 className="sr-only" id="catalog-combos-title" tabIndex={-1}>
              {catalog.copy.combosLabel}
            </h1>
            <div
              data-catalog-fixed-chrome
              className="grid min-w-0 border-b border-(--ui-command-border)"
            >
              <section
                data-catalog-filter-summary
                aria-label={catalog.copy.filtersLabel}
                className="grid min-w-0 bg-(--ui-command-surface)"
              >
                <FilterControlGroup
                  {...catalog.filters}
                  drawerRef={filterDrawerRef}
                  triggerRef={filterTriggerRef}
                />
              </section>

              <Show when={Boolean(catalog.persistenceWarning)}>
                {() => (
                  <div className="border-t border-(--ui-command-border) bg-(--ui-command-surface) p-2">
                    <StatusMessage tone={uiToneModes.warning}>
                      {catalog.copy.persistenceWarning}
                    </StatusMessage>
                  </div>
                )}
              </Show>
            </div>

            <section
              ref={resultScrollerRef}
              inert={catalog.filtersOpen ? true : undefined}
              data-catalog-result-scroller
              aria-labelledby="catalog-combos-title"
              className="h-full min-h-0 min-w-0 overflow-y-auto bg-(--ui-command-surface)"
            >
              <ComboList {...catalog.list} />
            </section>
          </div>
        )}
      </Show>
    </main>
  );
}

CatalogPage.displayName = "CatalogPage";
