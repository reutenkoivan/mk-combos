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
      src={asset.src}
      draggable={draggable}
      aria-hidden={decorative || undefined}
      alt={decorative ? "" : asset.accessibleLabel}
    />
  );
}
