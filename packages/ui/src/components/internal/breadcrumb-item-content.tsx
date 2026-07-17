import { Present, type PresentContentProps, Show } from "../../primitives/conditional";
import { cx } from "../../recipes/class-name";
import type { BreadcrumbItem, BreadcrumbItemIcon } from "../type";

type BreadcrumbItemContentProps = Readonly<{
  className?: string;
  item: BreadcrumbItem;
}>;

type BreadcrumbIconValue = Readonly<{
  icon: BreadcrumbItemIcon;
  kind: BreadcrumbItem["kind"];
}>;

function BreadcrumbIconContent({ value }: PresentContentProps<BreadcrumbIconValue>) {
  return (
    <span
      aria-hidden="true"
      data-breadcrumb-icon
      className={cx(
        "grid h-6 w-6 shrink-0 place-items-center overflow-hidden border border-(--ui-separator) bg-(--ui-window) font-mono text-[0.55rem] font-semibold uppercase text-(--ui-muted-text)",
      )}
    >
      <Show
        when={Boolean(value.icon.src)}
        fallback={() => <span data-breadcrumb-icon-fallback>{value.icon.fallbackLabel}</span>}
      >
        {() => (
          <img
            alt=""
            src={value.icon.src}
            className={cx(
              "h-full w-full",
              value.kind === "character" ? "object-cover" : "object-contain p-0.5",
            )}
          />
        )}
      </Show>
    </span>
  );
}

BreadcrumbIconContent.displayName = "BreadcrumbIconContent";

export function BreadcrumbItemContent({ className, item }: BreadcrumbItemContentProps) {
  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2", className)}>
      <Present value={item.icon ? { icon: item.icon, kind: item.kind } : undefined}>
        {BreadcrumbIconContent}
      </Present>
      <span className="truncate" data-breadcrumb-label>
        {item.label}
      </span>
    </span>
  );
}

BreadcrumbItemContent.displayName = "BreadcrumbItemContent";
