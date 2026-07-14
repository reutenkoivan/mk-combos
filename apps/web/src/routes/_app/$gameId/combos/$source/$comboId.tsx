import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder, RouteRecoveryPage } from "../../../../../app/route-placeholder";
import { parseComboDetailPathParams } from "../../../../../routing/route-params";

export const Route = createFileRoute("/_app/$gameId/combos/$source/$comboId")({
  component: ComboDetailPlaceholder,
  errorComponent: RouteRecoveryPage,
  params: {
    parse: parseComboDetailPathParams,
  },
});

function ComboDetailPlaceholder() {
  const { comboId, source } = Route.useParams();

  return (
    <RoutePlaceholder
      description="Combo detail routing is validated and connected to the active game."
      details={`Source: ${source} · Combo: ${comboId}. Detail orchestration follows in roadmap step 26.`}
      pageCode="UI-PAGE-004"
      title="Combo detail"
    />
  );
}
