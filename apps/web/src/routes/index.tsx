import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: BootstrapPage,
});

function BootstrapPage() {
  return (
    <main
      className="grid min-h-dvh place-items-center bg-[var(--ui-window)] p-6 text-[var(--ui-text)]"
      data-app-surface="bootstrap"
    >
      <section className="grid max-w-2xl justify-items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ui-accent)]">
          Static application shell
        </p>
        <h1 className="font-[var(--ui-font-display)] text-4xl font-semibold tracking-tight">
          MK Combos
        </h1>
        <p className="max-w-xl text-sm text-[var(--ui-muted-text)]">
          The shared route shell is ready for installed games and application pages.
        </p>
      </section>
    </main>
  );
}
