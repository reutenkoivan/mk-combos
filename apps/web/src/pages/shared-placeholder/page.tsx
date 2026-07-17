import { Show } from "@mk-combos/ui/primitives/conditional";

import { useActiveGameBusiness } from "../../game-business/active-game/provider";

type SharedPlaceholderPageProps = Readonly<{
  description: string;
  details?: string;
  pageCode: string;
  title: string;
}>;

export function SharedPlaceholderPage(props: SharedPlaceholderPageProps) {
  const activeBusiness = useActiveGameBusiness();

  return (
    <main
      data-ui-page={props.pageCode}
      data-active-game={activeBusiness.id}
      className="grid min-h-full content-start gap-4 bg-(--ui-window) p-6 text-(--ui-text)"
    >
      <header className="grid max-w-3xl gap-2 border-l-4 border-(--ui-accent) py-1 pl-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-(--ui-accent)">
          {props.pageCode}
        </span>
        <h1 className="font-(--ui-font-display) text-3xl font-semibold tracking-tight">
          {props.title}
        </h1>
        <p className="text-sm text-(--ui-muted-text)">{props.description}</p>
        <p className="text-xs text-(--ui-muted-text)">Active game: {activeBusiness.label}</p>
        <Show when={Boolean(props.details)}>
          {() => <p className="text-xs text-(--ui-muted-text)">{props.details}</p>}
        </Show>
      </header>
    </main>
  );
}
