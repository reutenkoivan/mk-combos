import type { ComponentType, ReactNode } from "react";

export type ShowProps = Readonly<{
  children: () => ReactNode;
  fallback?: () => ReactNode;
  when: boolean;
}>;

export type PresentContentProps<Value> = Readonly<{
  value: Value;
}>;

export type PresentProps<Value extends NonNullable<unknown>> = Readonly<{
  children: ComponentType<PresentContentProps<Value>>;
  fallback?: ReactNode;
  value: Value | null | undefined;
}>;

export function Show({ children, fallback, when }: ShowProps): ReactNode {
  if (when) {
    return children();
  }

  return fallback?.() ?? null;
}

Show.displayName = "Show";

export function Present<Value extends NonNullable<unknown>>({
  children: Content,
  fallback = null,
  value,
}: PresentProps<Value>): ReactNode {
  if (value === null || value === undefined) {
    return fallback;
  }

  return <Content value={value} />;
}

Present.displayName = "Present";
