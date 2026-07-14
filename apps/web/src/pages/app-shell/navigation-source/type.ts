import type { LanguageCode } from "@mk-combos/contracts/settings/type";
import type { UiResponsiveMode } from "@mk-combos/ui/components/type";

import type { InstalledGameBusiness } from "../../../game-business/installed-games/type";
import type { AppShellRoute } from "../route-state/type";

export type AppShellNavigationRequest = () => Promise<void>;

export type AppShellSource = Readonly<{
  methods: Readonly<{
    requestGameMenuOpen: (open: boolean) => void;
    requestNavigateAction: (action: string) => void;
    requestSelectGame: (gameId: string) => void;
    requestTopBarMenuOpen: (open: boolean) => void;
  }>;
  state: Readonly<{
    activeBusiness: InstalledGameBusiness;
    gameMenuOpen: boolean;
    language: LanguageCode;
    navigationAvailable: boolean;
    navigationPending: boolean;
    responsiveMode: UiResponsiveMode;
    route: AppShellRoute;
    topBarMenuOpen: boolean;
  }>;
}>;
