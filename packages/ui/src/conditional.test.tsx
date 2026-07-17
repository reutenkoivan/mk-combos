import { fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import { uiContractGroups } from "@mk-combos/ui/contract";
import {
  Present,
  type PresentContentProps,
  type PresentProps,
  Show,
  type ShowProps,
} from "@mk-combos/ui/primitives/conditional";
import { type ComponentType, type ReactNode, useEffect, useState } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import uiPackage from "../package.json";
import uiTsdownConfig from "../tsdown.config";

type LifecycleValue = Readonly<{
  events: string[];
  label: string;
  onRender: () => void;
}>;

function LifecycleContent({ value }: PresentContentProps<LifecycleValue>) {
  const [count, setCount] = useState(0);
  const { events, label, onRender } = value;
  onRender();

  useEffect(() => {
    events.push("content:mount");

    return () => {
      events.push("content:cleanup");
    };
  }, [events]);

  return (
    <button onClick={() => setCount((currentCount) => currentCount + 1)} type="button">
      content:{label}:{count}
    </button>
  );
}

type LifecycleFallbackProps = Readonly<{
  events: string[];
  onRender: () => void;
}>;

function LifecycleFallback({ events, onRender }: LifecycleFallbackProps) {
  const [count, setCount] = useState(0);
  onRender();

  useEffect(() => {
    events.push("fallback:mount");

    return () => {
      events.push("fallback:cleanup");
    };
  }, [events]);

  return (
    <button onClick={() => setCount((currentCount) => currentCount + 1)} type="button">
      fallback:{count}
    </button>
  );
}

function FalsyValueContent({ value }: PresentContentProps<false | 0 | "">) {
  return <output data-testid="present-value">{JSON.stringify(value)}</output>;
}

type MappingValue = Readonly<{
  items: readonly string[];
  onMap: (item: string) => void;
}>;

function MappingItems({ items, onMap }: MappingValue) {
  return items.map((item) => {
    onMap(item);
    return <span key={item}>{item}</span>;
  });
}

function PresentMappingItems({ value }: PresentContentProps<MappingValue>) {
  return <MappingItems {...value} />;
}

describe("conditional rendering primitives", () => {
  it("publishes the conditional entrypoint through every public contract", async () => {
    const resolvedTsdownExport = await uiTsdownConfig({}, { ci: true });
    const resolvedTsdownConfig = Array.isArray(resolvedTsdownExport)
      ? resolvedTsdownExport[0]
      : resolvedTsdownExport;
    const sourceExports = uiPackage.exports as Record<string, string>;
    const publishExports = uiPackage.publishConfig.exports as Record<string, string>;
    const tsdownEntries = resolvedTsdownConfig?.entry as Record<string, string>;

    expect(Show).toBeTypeOf("function");
    expect(Present).toBeTypeOf("function");
    expect(sourceExports["./primitives/conditional"]).toBe("./src/primitives/conditional.tsx");
    expect(publishExports["./primitives/conditional"]).toBe("./dist/primitives/conditional.mjs");
    expect(tsdownEntries["primitives/conditional"]).toBe("src/primitives/conditional.tsx");
    expect(uiContractGroups.primitives.conditional).toBe("@mk-combos/ui/primitives/conditional");
  });

  it("keeps the public props strict and hook-component compatible", () => {
    type ContentWithRequiredExtraProp = ComponentType<{ extra: string; value: string }>;
    type RawFallbackCallback = () => ReactNode;
    type RawValueCallback = (value: string) => ReactNode;

    expectTypeOf<ShowProps["when"]>().toEqualTypeOf<boolean>();
    expectTypeOf<ShowProps["children"]>().toEqualTypeOf<() => ReactNode>();
    expectTypeOf<ShowProps["fallback"]>().toEqualTypeOf<(() => ReactNode) | undefined>();
    expectTypeOf<{ children: ReactNode; when: boolean }>().not.toMatchTypeOf<ShowProps>();
    expectTypeOf<{ children: () => ReactNode; when: string }>().not.toMatchTypeOf<ShowProps>();
    expectTypeOf<PresentProps<string>["value"]>().toEqualTypeOf<string | null | undefined>();
    expectTypeOf<PresentProps<string>["children"]>().toEqualTypeOf<
      ComponentType<PresentContentProps<string>>
    >();
    expectTypeOf<RawValueCallback>().not.toMatchTypeOf<PresentProps<string>["children"]>();
    expectTypeOf<ContentWithRequiredExtraProp>().not.toMatchTypeOf<
      PresentProps<string>["children"]
    >();
    expectTypeOf<PresentProps<string>["fallback"]>().toEqualTypeOf<ReactNode>();
    expectTypeOf<RawFallbackCallback>().not.toMatchTypeOf<PresentProps<string>["fallback"]>();
  });

  it("renders Show branches without a wrapper and preserves falsy fallbacks", () => {
    const fallbackRender = vi.fn();
    const events: string[] = [];
    const fallbackFactory = vi.fn(() => (
      <LifecycleFallback events={events} onRender={fallbackRender} />
    ));
    const view = render(
      <Show fallback={fallbackFactory} when>
        {() => <span data-testid="show-content">content</span>}
      </Show>,
    );

    expect(view.container.firstElementChild).toBe(screen.getByTestId("show-content"));
    expect(fallbackFactory).not.toHaveBeenCalled();
    expect(fallbackRender).not.toHaveBeenCalled();

    view.rerender(
      <Show fallback={fallbackFactory} when={false}>
        {() => <span>content</span>}
      </Show>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fallback:0" }));

    expect(screen.getByRole("button", { name: "fallback:1" })).toBeDefined();
    expect(fallbackFactory).toHaveBeenCalledOnce();
    expect(fallbackRender).toHaveBeenCalled();

    view.rerender(
      <Show fallback={() => 0} when={false}>
        {() => "content"}
      </Show>,
    );
    expect(view.container.textContent).toBe("0");

    view.rerender(<Show when={false}>{() => "content"}</Show>);
    expect(view.container.childNodes).toHaveLength(0);
  });

  it("treats only null and undefined as absent Present values", () => {
    const value: false | 0 | "" = false;
    const view = render(
      <Present fallback={<span>absent</span>} value={value}>
        {FalsyValueContent}
      </Present>,
    );

    expect(view.container.firstElementChild).toBe(screen.getByTestId("present-value"));
    expect(screen.getByTestId("present-value").textContent).toBe("false");

    view.rerender(
      <Present fallback={<span>absent</span>} value={0}>
        {FalsyValueContent}
      </Present>,
    );
    expect(screen.getByTestId("present-value").textContent).toBe("0");

    view.rerender(
      <Present fallback={<span>absent</span>} value="">
        {FalsyValueContent}
      </Present>,
    );
    expect(screen.getByTestId("present-value").textContent).toBe('""');

    view.rerender(
      <Present fallback={<span>absent</span>} value={null}>
        {FalsyValueContent}
      </Present>,
    );
    expect(screen.getByText("absent")).toBeDefined();

    view.rerender(
      <Present fallback={<span>absent</span>} value={undefined}>
        {FalsyValueContent}
      </Present>,
    );
    expect(screen.getByText("absent")).toBeDefined();
  });

  it("passes object identity through Present", () => {
    const payload = { id: "payload" };
    let received: typeof payload | undefined;

    function IdentityContent({ value }: PresentContentProps<typeof payload>) {
      received = value;
      return <span>{value.id}</span>;
    }

    const view = render(<Present value={payload}>{IdentityContent}</Present>);

    expect(received).toBe(payload);
    expect(view.container.firstElementChild).toBe(screen.getByText("payload"));

    view.rerender(<Present value={null}>{IdentityContent}</Present>);
    expect(view.container.childNodes).toHaveLength(0);
  });

  it("does not execute inactive Show branch factories or their O(n) mappers", () => {
    const onMap = vi.fn();
    const value: MappingValue = { items: ["first", "second"], onMap };
    const view = render(
      <Show when={false}>
        {() =>
          value.items.map((item) => {
            onMap(item);
            return <span key={item}>{item}</span>;
          })
        }
      </Show>,
    );

    expect(onMap).not.toHaveBeenCalled();

    view.rerender(
      <Show when>
        {() =>
          value.items.map((item) => {
            onMap(item);
            return <span key={item}>{item}</span>;
          })
        }
      </Show>,
    );
    expect(onMap.mock.calls.map(([item]) => item)).toEqual(["first", "second"]);

    onMap.mockClear();
    view.rerender(<Present value={null}>{PresentMappingItems}</Present>);
    expect(onMap).not.toHaveBeenCalled();

    view.rerender(<Present value={value}>{PresentMappingItems}</Present>);
    expect(onMap.mock.calls.map(([item]) => item)).toEqual(["first", "second"]);
  });

  it("runs hooks only in the active stable Present branch", () => {
    const contentRender = vi.fn();
    const fallbackRender = vi.fn();
    const events: string[] = [];
    const value: LifecycleValue = { events, label: "first", onRender: contentRender };
    const view = render(
      <Present
        value={value}
        fallback={<LifecycleFallback events={events} onRender={fallbackRender} />}
      >
        {LifecycleContent}
      </Present>,
    );

    expect(screen.getByRole("button", { name: "content:first:0" })).toBeDefined();
    expect(fallbackRender).not.toHaveBeenCalled();
    expect(events).toEqual(["content:mount"]);

    fireEvent.click(screen.getByRole("button", { name: "content:first:0" }));
    view.rerender(
      <Present
        value={{ ...value, label: "second" }}
        fallback={<LifecycleFallback events={events} onRender={fallbackRender} />}
      >
        {LifecycleContent}
      </Present>,
    );
    expect(screen.getByRole("button", { name: "content:second:1" })).toBeDefined();
    expect(events).toEqual(["content:mount"]);

    const contentRenderCount = contentRender.mock.calls.length;
    view.rerender(
      <Present
        value={null}
        fallback={<LifecycleFallback events={events} onRender={fallbackRender} />}
      >
        {LifecycleContent}
      </Present>,
    );
    expect(screen.getByRole("button", { name: "fallback:0" })).toBeDefined();
    expect(contentRender).toHaveBeenCalledTimes(contentRenderCount);
    expect(events).toEqual(["content:mount", "content:cleanup", "fallback:mount"]);

    fireEvent.click(screen.getByRole("button", { name: "fallback:0" }));
    view.rerender(
      <Present
        value={undefined}
        fallback={<LifecycleFallback events={events} onRender={fallbackRender} />}
      >
        {LifecycleContent}
      </Present>,
    );
    expect(screen.getByRole("button", { name: "fallback:1" })).toBeDefined();
    expect(contentRender).toHaveBeenCalledTimes(contentRenderCount);

    const fallbackRenderCount = fallbackRender.mock.calls.length;
    view.rerender(
      <Present
        value={value}
        fallback={<LifecycleFallback events={events} onRender={fallbackRender} />}
      >
        {LifecycleContent}
      </Present>,
    );
    expect(screen.getByRole("button", { name: "content:first:0" })).toBeDefined();
    expect(fallbackRender).toHaveBeenCalledTimes(fallbackRenderCount);
    expect(events).toEqual([
      "content:mount",
      "content:cleanup",
      "fallback:mount",
      "fallback:cleanup",
      "content:mount",
    ]);
  });
});
