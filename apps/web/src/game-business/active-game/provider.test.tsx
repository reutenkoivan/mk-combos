import { render, screen } from "@mk-combos/contracts/test/unit/react";
import { describe, expect, it, vi } from "vitest";
import type { InstalledGameBusiness } from "../installed-games/type";
import { installedGames } from "../installed-games/value";
import { ActiveGameBusinessProvider, useActiveGameBusiness } from "./provider";

function ActiveGameConsumer(props: Readonly<{ onRead: (value: InstalledGameBusiness) => void }>) {
  const activeBusiness = useActiveGameBusiness();
  props.onRead(activeBusiness);

  return <span>{activeBusiness.label}</span>;
}

describe("ActiveGameBusinessProvider", () => {
  it("provides the exact installed registry object by identity", () => {
    const onRead = vi.fn();

    render(
      <ActiveGameBusinessProvider business={installedGames[1]}>
        <ActiveGameConsumer onRead={onRead} />
      </ActiveGameBusinessProvider>,
    );

    expect(screen.getByText("MK1")).toBeTruthy();
    expect(onRead).toHaveBeenCalledWith(installedGames[1]);
  });

  it("fails clearly outside the app shell provider", () => {
    expect(() => render(<ActiveGameConsumer onRead={vi.fn()} />)).toThrow(
      "useActiveGameBusiness must be used within ActiveGameBusinessProvider",
    );
  });
});
