import { ComboDetailHeader } from "@mk-combos/ui/components/combo-detail-header";
import {
  ComboFrameMeter,
  comboFrameMeterLifecycles,
} from "@mk-combos/ui/components/combo-frame-meter";
import { ComboMetadataGrid } from "@mk-combos/ui/components/combo-metadata-grid";
import { ComboWhiteboard } from "@mk-combos/ui/components/combo-whiteboard";
import { ErrorState } from "@mk-combos/ui/components/error-state";
import { Show } from "@mk-combos/ui/primitives/conditional";

import { useComboDetailState } from "./detail-state/hook";
import { comboDetailPageStates } from "./detail-state/value";
import type { ComboDetailPathParams } from "./path-params/type";

type ComboDetailPageProps = Readonly<ComboDetailPathParams>;

export function ComboDetailPage(props: ComboDetailPageProps) {
  const detail = useComboDetailState(props);
  const prepared = detail.prepared;

  return (
    <main
      data-ui-page="UI-PAGE-004"
      className="grid min-h-full content-start justify-items-center bg-(--ui-window) p-4 text-(--ui-text) sm:p-6"
    >
      <div className="grid w-full max-w-7xl gap-6">
        {prepared.state === comboDetailPageStates.ready ? (
          <>
            <div className="grid gap-2 border-s-4 border-(--ui-accent) py-1 ps-4">
              <ComboDetailHeader
                {...prepared.header}
                onRequestAction={detail.handleHeaderAction}
                controllerFocusedActionId={detail.controllerFocusedHeaderActionId}
              />
              <p className="max-w-3xl text-sm leading-6 text-(--ui-muted-text)">
                {prepared.description}
              </p>
            </div>

            <div className="grid min-w-0 items-start gap-6 min-[70rem]:grid-cols-[minmax(0,1fr)_minmax(22rem,0.42fr)] min-[70rem]:gap-8">
              <section aria-labelledby="combo-route-title" className="grid min-w-0 gap-3">
                <h2
                  id="combo-route-title"
                  className="font-(--ui-font-display) text-xl font-semibold"
                >
                  {detail.copy.howToTitle}
                </h2>
                <ComboWhiteboard
                  sourceSurface="combo-detail"
                  model={detail.whiteboardModel}
                  source={detail.whiteboardSource}
                  notationDisplayMode={detail.notationDisplayMode}
                />
              </section>

              <aside aria-labelledby="combo-frame-title" className="grid min-w-0 gap-3">
                <h2
                  id="combo-frame-title"
                  className="font-(--ui-font-display) text-xl font-semibold"
                >
                  {detail.copy.frameDataTitle}
                </h2>
                <ComboFrameMeter
                  model={detail.frameModel}
                  sourceSurface="combo-detail"
                  labels={prepared.frameLabels}
                  snapshot={detail.frameSnapshot}
                  responsiveMode={detail.responsiveMode}
                  lifecycle={comboFrameMeterLifecycles.ready}
                />
              </aside>
            </div>

            <div className="grid min-w-0 items-start gap-6 min-[70rem]:grid-cols-[minmax(0,0.65fr)_minmax(20rem,0.35fr)] min-[70rem]:gap-8">
              <section aria-labelledby="combo-metadata-title" className="grid min-w-0 gap-3">
                <h2
                  id="combo-metadata-title"
                  className="font-(--ui-font-display) text-xl font-semibold"
                >
                  {detail.copy.metadataTitle}
                </h2>
                <ComboMetadataGrid {...prepared.metadata} />
              </section>

              <Show when={Boolean(prepared.notes)}>
                {() => (
                  <section
                    aria-labelledby="combo-notes-title"
                    className="grid min-w-0 gap-2 border-s-2 border-(--ui-separator) ps-4"
                  >
                    <h2 className="font-semibold" id="combo-notes-title">
                      {detail.copy.notesTitle}
                    </h2>
                    <p className="break-words text-sm leading-6 text-(--ui-muted-text)">
                      {prepared.notes}
                    </p>
                  </section>
                )}
              </Show>
            </div>
          </>
        ) : (
          <ErrorState
            {...prepared.error}
            onRequestAction={detail.handleErrorAction}
            controllerFocusedActionId={detail.controllerFocusedErrorActionId}
          />
        )}
      </div>
    </main>
  );
}

ComboDetailPage.displayName = "ComboDetailPage";
