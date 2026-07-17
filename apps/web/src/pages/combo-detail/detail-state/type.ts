import type { ComboDetailHeaderProps } from "@mk-combos/ui/components/combo-detail-header";
import type {
  ComboFrameMeterLabels,
  ComboFrameMeterSnapshot,
} from "@mk-combos/ui/components/combo-frame-meter";
import type { ComboMetadataGridProps } from "@mk-combos/ui/components/combo-metadata-grid";
import type { ComboWhiteboardSource } from "@mk-combos/ui/components/combo-whiteboard";
import type { ErrorStateProps } from "@mk-combos/ui/components/error-state";

import type { comboDetailPageStates } from "./value";

type ComboDetailUnavailable = Readonly<{
  error: Omit<ErrorStateProps, "onRequestAction">;
  state: typeof comboDetailPageStates.error | typeof comboDetailPageStates.notFound;
}>;

export type ComboDetailReady = Readonly<{
  description: string;
  frameLabels: ComboFrameMeterLabels;
  frameSnapshot: ComboFrameMeterSnapshot;
  header: Omit<ComboDetailHeaderProps, "onRequestAction">;
  metadata: ComboMetadataGridProps;
  notes?: string;
  state: typeof comboDetailPageStates.ready;
  whiteboardSource: ComboWhiteboardSource;
}>;

export type ComboDetailPreparedState = ComboDetailUnavailable | ComboDetailReady;
