import type { GameId } from "@mk-combos/contracts/identity/type";
import { gameRouteKinds } from "@mk-combos/contracts/routes/value";
import type { LanguageCode } from "@mk-combos/contracts/settings/type";
import type { BreadcrumbItem } from "@mk-combos/ui/components/type";

import { resolveLocalizedText } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import { resolveInstalledCatalogOptionIcon } from "../../../game-business/installed-games/catalog-option-icon/runtime";
import { resolveInstalledGameCatalogAdapter } from "../../../game-business/installed-games/runtime";
import { shellActionIds } from "../navigation-source/value";
import type { AppShellCatalogRoute, AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";
import { shellBreadcrumbIds } from "./value";

function getBreadcrumbIcon(label: string, src?: string): NonNullable<BreadcrumbItem["icon"]> {
  const words = label.trim().split(/\s+/u);
  const fallbackLabel = (
    words.length > 1
      ? words.slice(0, 2).map((word) => Array.from(word)[0])
      : Array.from(words[0] ?? label).slice(0, 2)
  )
    .filter((character): character is string => character !== undefined)
    .join("")
    .toLocaleUpperCase();

  return {
    fallbackLabel: fallbackLabel || "?",
    ...(src === undefined ? {} : { src }),
  };
}

function getCatalogBreadcrumbs(
  route: AppShellCatalogRoute,
  activeGameId: GameId,
  language: LanguageCode,
  copy: AppCopy["shell"],
  specificationCurrent = true,
): readonly BreadcrumbItem[] {
  const catalog: BreadcrumbItem = {
    current: false,
    disabled: false,
    id: shellBreadcrumbIds.catalog,
    kind: gameRouteKinds.catalog,
    label: copy.catalog,
    target: {
      params: { gameId: activeGameId },
      route: "/$gameId/catalog",
      surfaceCode: "UI-PAGE-003",
    },
  };
  const adapter = resolveInstalledGameCatalogAdapter(activeGameId);

  if (!adapter || !route.characterSlug) {
    return [{ ...catalog, current: true, target: undefined }];
  }

  const character = adapter
    .characterOptions()
    .find((option) => option.routeSlug === route.characterSlug);

  if (!character) {
    return [{ ...catalog, current: true, target: undefined }];
  }

  const characterLabel = resolveLocalizedText(character.label, language, route.characterSlug);
  const characterIcon = resolveInstalledCatalogOptionIcon(activeGameId, "character", character.id);

  const characterBreadcrumb: BreadcrumbItem = {
    current: false,
    disabled: false,
    icon: getBreadcrumbIcon(characterLabel, characterIcon?.src),
    id: shellActionIds.catalogCharacter,
    kind: "character",
    label: characterLabel,
    target: {
      params: { character: route.characterSlug, gameId: activeGameId },
      route: "/$gameId/catalog/$character",
      surfaceCode: "UI-PAGE-003",
    },
  };

  if (!route.specificationSlug) {
    return [catalog, { ...characterBreadcrumb, current: true, target: undefined }];
  }

  const specification = adapter
    .specificationOptions(character.id)
    .find((option) => option.routeSlug === route.specificationSlug);

  if (!specification) {
    return [catalog, { ...characterBreadcrumb, current: true, target: undefined }];
  }

  const specificationLabel = resolveLocalizedText(
    specification.label,
    language,
    route.specificationSlug,
  );
  const specificationIcon = resolveInstalledCatalogOptionIcon(
    activeGameId,
    adapter.contextKind,
    specification.id,
  );

  return [
    catalog,
    characterBreadcrumb,
    {
      current: specificationCurrent,
      disabled: false,
      icon: getBreadcrumbIcon(specificationLabel, specificationIcon?.src),
      id: shellActionIds.catalogSpecification,
      kind: adapter.contextKind,
      label: specificationLabel,
      target: specificationCurrent
        ? undefined
        : {
            params: {
              character: route.characterSlug,
              gameId: activeGameId,
              specification: route.specificationSlug,
            },
            route: "/$gameId/catalog/$character/$specification",
            surfaceCode: "UI-PAGE-003",
          },
    },
  ];
}

export function getBreadcrumbs(
  route: AppShellRoute,
  activeGameId: GameId,
  language: LanguageCode,
  copy: AppCopy["shell"],
): readonly BreadcrumbItem[] {
  const catalog: BreadcrumbItem = {
    current: false,
    disabled: false,
    id: shellBreadcrumbIds.catalog,
    kind: gameRouteKinds.catalog,
    label: copy.catalog,
    target: {
      params: { gameId: activeGameId },
      route: "/$gameId/catalog",
      surfaceCode: "UI-PAGE-003",
    },
  };

  switch (route.kind) {
    case gameRouteKinds.catalog:
      return getCatalogBreadcrumbs(route, activeGameId, language, copy);
    case gameRouteKinds.lists:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.lists,
          kind: gameRouteKinds.lists,
          label: copy.namedLists,
        },
      ];
    case gameRouteKinds.builder:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.builder,
          kind: gameRouteKinds.builder,
          label: copy.builder,
        },
      ];
    case gameRouteKinds.comboDetail: {
      const detailBreadcrumb: BreadcrumbItem = {
        current: true,
        disabled: false,
        id: shellBreadcrumbIds.comboDetail,
        kind: gameRouteKinds.comboDetail,
        label: route.comboId,
        truncationLabel: `Combo ${route.comboId}`,
      };

      const contextualBreadcrumbs = getCatalogBreadcrumbs(
        {
          characterSlug: route.characterSlug,
          gameId: activeGameId,
          kind: gameRouteKinds.catalog,
          specificationSlug: route.specificationSlug,
        },
        activeGameId,
        language,
        copy,
        false,
      );

      if (contextualBreadcrumbs.length === 3) {
        return [...contextualBreadcrumbs, detailBreadcrumb];
      }

      return [catalog, detailBreadcrumb];
    }
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
