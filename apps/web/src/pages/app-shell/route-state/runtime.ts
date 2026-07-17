import { GameRouteSchema } from "@mk-combos/contracts/routes/schema";
import type { GameRoute } from "@mk-combos/contracts/routes/type";
import { gameRouteKinds } from "@mk-combos/contracts/routes/value";
import type { useMatchRoute } from "@tanstack/react-router";

import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import type { AppShellCatalogRoute, AppShellRoute } from "./type";
import { appShellOnlyRouteKinds } from "./value";

function parseInstalledGameRoute(input: unknown): GameRoute | undefined {
  const parsed = GameRouteSchema.safeParse(input);

  if (!parsed.success) {
    return undefined;
  }

  if ("gameId" in parsed.data && resolveInstalledGame(parsed.data.gameId) === undefined) {
    return undefined;
  }

  return parsed.data;
}

function parseInstalledCatalogRoute(
  gameId: unknown,
  characterSlug?: string,
  specificationSlug?: string,
): AppShellCatalogRoute | undefined {
  const parsed = parseInstalledGameRoute({ gameId, kind: gameRouteKinds.catalog });

  if (parsed?.kind !== gameRouteKinds.catalog) {
    return undefined;
  }

  return {
    ...parsed,
    ...(characterSlug === undefined ? {} : { characterSlug }),
    ...(specificationSlug === undefined ? {} : { specificationSlug }),
  };
}

export function resolveAppShellRoute(
  matchRoute: ReturnType<typeof useMatchRoute>,
  leafRouteHasError: boolean,
  routeRevision: string,
  routePathname = "",
): AppShellRoute {
  // `useMatchRoute` reads the router snapshot behind a stable callback. Keep
  // that snapshot in this resolver's data contract so React Compiler cannot
  // cache matches only by the callback identity.
  if (routeRevision.length === 0 || leafRouteHasError) {
    return { kind: appShellOnlyRouteKinds.recovery };
  }

  const comboDetailParams = matchRoute({
    fuzzy: false,
    to: "/$gameId/catalog/$character/$specification/$comboId",
  });

  if (comboDetailParams !== false) {
    const parsed = parseInstalledGameRoute({
      characterSlug: comboDetailParams.character,
      comboId: comboDetailParams.comboId,
      gameId: comboDetailParams.gameId,
      kind: gameRouteKinds.comboDetail,
      specificationSlug: comboDetailParams.specification,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const catalogResultParams = matchRoute({
    fuzzy: false,
    to: "/$gameId/catalog/$character/$specification",
  });

  if (catalogResultParams !== false) {
    const parsed = parseInstalledCatalogRoute(
      catalogResultParams.gameId,
      catalogResultParams.character,
      catalogResultParams.specification,
    );

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const catalogSpecificationParams = matchRoute({
    fuzzy: false,
    to: "/$gameId/catalog/$character",
  });

  if (catalogSpecificationParams !== false) {
    const parsed = parseInstalledCatalogRoute(
      catalogSpecificationParams.gameId,
      catalogSpecificationParams.character,
    );

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const catalogParams = matchRoute({ fuzzy: false, to: "/$gameId/catalog" });

  if (catalogParams !== false) {
    const parsed = parseInstalledCatalogRoute(catalogParams.gameId);

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const pathnameCatalogMatch = /^\/([^/]+)\/catalog(?:\/([^/]+)(?:\/([^/]+))?)?\/?$/.exec(
    routePathname,
  );

  if (pathnameCatalogMatch?.[1]) {
    const parsed = parseInstalledCatalogRoute(
      pathnameCatalogMatch[1],
      pathnameCatalogMatch[2],
      pathnameCatalogMatch[3],
    );

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const listsParams = matchRoute({ fuzzy: false, to: "/$gameId/lists" });

  if (listsParams !== false) {
    const parsed = parseInstalledGameRoute({
      gameId: listsParams.gameId,
      kind: gameRouteKinds.lists,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const builderParams = matchRoute({ fuzzy: false, to: "/$gameId/builder" });

  if (builderParams !== false) {
    const parsed = parseInstalledGameRoute({
      gameId: builderParams.gameId,
      kind: gameRouteKinds.builder,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  if (matchRoute({ fuzzy: false, to: "/" }) !== false) {
    return { kind: appShellOnlyRouteKinds.root };
  }

  return { kind: appShellOnlyRouteKinds.recovery };
}
