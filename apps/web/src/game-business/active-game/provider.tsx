import { createContext, type ReactNode, useContext } from "react";

import type { InstalledGameBusiness } from "../installed-games/type";

const ActiveGameBusinessContext = createContext<InstalledGameBusiness | undefined>(undefined);

type ActiveGameBusinessProviderProps = Readonly<{
  business: InstalledGameBusiness;
  children: ReactNode;
}>;

export function ActiveGameBusinessProvider({
  business,
  children,
}: ActiveGameBusinessProviderProps) {
  return <ActiveGameBusinessContext value={business}>{children}</ActiveGameBusinessContext>;
}

export function useActiveGameBusiness(): InstalledGameBusiness {
  const business = useContext(ActiveGameBusinessContext);

  if (business === undefined) {
    throw new Error("useActiveGameBusiness must be used within ActiveGameBusinessProvider");
  }

  return business;
}
