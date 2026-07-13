import { useCallback } from "react";

import type { UiPrimitiveOpenChangePayload } from "../../primitives/interaction";
import { mapBaseUiReason } from "../../primitives/internal";

type BaseUiOpenChangeDetails = {
  reason?: string;
};

export type UseBaseUiOpenChangeHandlerInput = {
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  sourceFocusTarget?: string;
};

export function useBaseUiOpenChangeHandler(input: UseBaseUiOpenChangeHandlerInput) {
  return useCallback(
    (open: boolean, details: BaseUiOpenChangeDetails) => {
      input.onOpenChange?.({
        open,
        reason: mapBaseUiReason(details.reason),
        sourceFocusTarget: input.sourceFocusTarget,
      });
    },
    [input.onOpenChange, input.sourceFocusTarget],
  );
}
