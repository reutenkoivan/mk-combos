import type { LucideIcon, LucideProps } from "lucide-react";

export type MkCombosIconMetadata = {
  accessibleLabel: string;
  name: string;
};

export type MkCombosIconProps = LucideProps & {
  decorative?: boolean;
};

export const createIconComponent = (Icon: LucideIcon, metadata: MkCombosIconMetadata) => {
  function MkCombosIcon(props: MkCombosIconProps) {
    const {
      "aria-hidden": ariaHidden,
      "aria-label": ariaLabel,
      decorative = false,
      ref,
      role,
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
      />
    );
  }

  MkCombosIcon.displayName = `${metadata.name}Icon`;

  return MkCombosIcon;
};
