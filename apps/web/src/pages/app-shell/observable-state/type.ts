import type { GlobalTopBarProps } from "@mk-combos/ui/components/global-top-bar";

import type { InstalledGameBusiness } from "../../../game-business/installed-games/type";

export type AppShellViewModel = Readonly<{
  activeBusiness: InstalledGameBusiness;
  navigationPending: boolean;
  topBar: GlobalTopBarProps;
}>;
