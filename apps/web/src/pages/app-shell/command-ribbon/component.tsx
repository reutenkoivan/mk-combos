import {
  NotationRenderer,
  notationRendererDensities,
  notationRendererWrappingModes,
} from "@mk-combos/ui/components/notation-renderer";

import { resolveRibbonCommandPresentation } from "./runtime";
import type { ControllerCommandRibbonProps } from "./type";

export function ControllerCommandRibbon(props: ControllerCommandRibbonProps) {
  return (
    <footer
      data-app-shell-controller-ribbon
      className="min-w-0 border-t border-(--ui-separator) bg-(--ui-toolbar) pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-2"
    >
      <nav aria-label={props.accessibleLabel}>
        <ul className="flex min-w-0 items-center gap-4 overflow-x-auto">
          {props.commands.map((command) => {
            const presentation = resolveRibbonCommandPresentation(command.commandIds);

            return (
              <li className="flex shrink-0 items-center gap-1.5" key={command.id}>
                {presentation.kind === "notation" ? (
                  <NotationRenderer
                    notation={[[presentation.token]]}
                    density={notationRendererDensities.compact}
                    notationDisplayMode={props.notationDisplayMode}
                    wrappingMode={notationRendererWrappingModes.inline}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-(--ui-font-display) text-xs font-semibold text-(--ui-text)"
                  >
                    {presentation.value}
                  </span>
                )}
                <span className="whitespace-nowrap text-xs text-(--ui-muted-text)">
                  {command.label}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}

ControllerCommandRibbon.displayName = "ControllerCommandRibbon";
