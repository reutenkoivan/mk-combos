import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverStub implements ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub;

if (typeof window !== "undefined") {
  window.scrollTo = vi.fn();
}
