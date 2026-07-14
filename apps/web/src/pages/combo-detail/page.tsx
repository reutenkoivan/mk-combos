import { SharedPlaceholderPage } from "../shared-placeholder/page";
import type { ComboDetailPathParams } from "./path-params/type";

type ComboDetailPageProps = Readonly<ComboDetailPathParams>;

export function ComboDetailPage({ comboId, source }: ComboDetailPageProps) {
  return (
    <SharedPlaceholderPage
      description="Combo detail routing is validated and connected to the active game."
      details={`Source: ${source} · Combo: ${comboId}. Detail orchestration follows in roadmap step 26.`}
      pageCode="UI-PAGE-004"
      title="Combo detail"
    />
  );
}
