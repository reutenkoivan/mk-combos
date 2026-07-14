import type { GameId } from "@mk-combos/contracts/identity/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import type { BreadcrumbItem } from "@mk-combos/ui/components/type";

import type { AppCopy } from "../../../app/localization/type";
import type { AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";
import { shellBreadcrumbIds } from "./value";

export function getBreadcrumbs(
  route: AppShellRoute,
  activeGameId: GameId,
  copy: AppCopy["shell"],
): readonly BreadcrumbItem[] {
  const catalog: BreadcrumbItem = {
    current: false,
    disabled: false,
    id: shellBreadcrumbIds.catalog,
    kind: appRouteKinds.catalog,
    label: copy.catalog,
    target: {
      params: { gameId: activeGameId },
      route: "/$gameId/catalog",
      surfaceCode: "UI-PAGE-003",
    },
  };

  switch (route.kind) {
    case appRouteKinds.catalog:
      return [{ ...catalog, current: true, target: undefined }];
    case appRouteKinds.lists:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.lists,
          kind: appRouteKinds.lists,
          label: copy.namedLists,
        },
      ];
    case appRouteKinds.builder:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.builder,
          kind: appRouteKinds.builder,
          label: copy.builder,
        },
      ];
    case appRouteKinds.comboDetail:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.comboDetail,
          kind: appRouteKinds.comboDetail,
          label: route.comboId,
          truncationLabel: `Combo ${route.comboId}`,
        },
      ];
    case appRouteKinds.settings:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.settings,
          kind: appRouteKinds.settings,
          label: copy.settings,
        },
      ];
    case appShellOnlyRouteKinds.root:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.root,
          kind: appShellOnlyRouteKinds.root,
          label: copy.firstLaunch,
        },
      ];
    case appShellOnlyRouteKinds.recovery:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.recovery,
          kind: appShellOnlyRouteKinds.recovery,
          label: copy.unavailableRoute,
        },
      ];
  }
}
