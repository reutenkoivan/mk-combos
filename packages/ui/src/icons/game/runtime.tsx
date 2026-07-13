import type { ComponentPropsWithoutRef } from "react";

import type { GameIconAsset } from "./type";

export type GameIconProps = Omit<ComponentPropsWithoutRef<"img">, "alt" | "src"> & {
  asset: GameIconAsset;
  decorative?: boolean;
};

export function GameIcon({
  asset,
  decorative = false,
  draggable = false,
  ...props
}: GameIconProps) {
  return (
    <img
      {...props}
      alt={decorative ? "" : asset.accessibleLabel}
      aria-hidden={decorative || undefined}
      draggable={draggable}
      src={asset.src}
    />
  );
}
