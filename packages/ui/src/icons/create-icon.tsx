import type { LucideIcon, LucideProps } from "lucide-react";

export type MkCombosIconMetadata = {
  accessibleLabel: string;
  name: string;
};

export type MkCombosIconSize = number | "medium" | "mini" | "small";

export type MkCombosIconProps = Omit<LucideProps, "size"> & {
  decorative?: boolean;
  size?: MkCombosIconSize;
};

const iconSizePixels = {
  medium: 20,
  mini: 14,
  small: 16,
} as const satisfies Record<Exclude<MkCombosIconSize, number>, number>;

const resolveIconSize = (size: MkCombosIconSize | undefined) =>
  typeof size === "string" ? iconSizePixels[size] : size;

export const createIconComponent = (Icon: LucideIcon, metadata: MkCombosIconMetadata) => {
  function MkCombosIcon(props: MkCombosIconProps) {
    const {
      "aria-hidden": ariaHidden,
      "aria-label": ariaLabel,
      decorative = false,
      ref,
      role,
      size,
      ...iconProps
    } = props;

    return (
      <Icon
        {...iconProps}
        aria-hidden={decorative ? true : ariaHidden}
        aria-label={decorative ? undefined : (ariaLabel ?? metadata.accessibleLabel)}
        data-ui-icon={metadata.name}
        ref={ref}
        role={decorative ? undefined : (role ?? "img")}
        size={resolveIconSize(size)}
      />
    );
  }

  MkCombosIcon.displayName = `${metadata.name}Icon`;

  return MkCombosIcon;
};
