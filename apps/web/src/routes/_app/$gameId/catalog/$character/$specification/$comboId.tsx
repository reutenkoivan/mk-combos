import { createFileRoute } from "@tanstack/react-router";

import { ComboDetailPage } from "../../../../../../pages/combo-detail/page";
import { parseComboDetailPathParams } from "../../../../../../pages/combo-detail/path-params/runtime";
import { RouteRecoveryPage } from "../../../../../../pages/route-recovery/page";

export const Route = createFileRoute("/_app/$gameId/catalog/$character/$specification/$comboId")({
  component: ComboDetailRoute,
  errorComponent: RouteRecoveryPage,
  params: {
    parse: parseComboDetailPathParams,
  },
});

function ComboDetailRoute() {
  const { character, comboId, specification } = Route.useParams();

  return <ComboDetailPage character={character} comboId={comboId} specification={specification} />;
}
