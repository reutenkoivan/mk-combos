import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import type { ControllerCommandId } from "@mk-combos/controller-bridge/command/type";

type ControllerCommandRibbonItem = Readonly<{
  commandIds: readonly ControllerCommandId[];
  id: string;
  label: string;
}>;

export type ControllerCommandRibbonProps = Readonly<{
  accessibleLabel: string;
  commands: readonly ControllerCommandRibbonItem[];
  notationDisplayMode: NotationDisplayMode;
}>;
