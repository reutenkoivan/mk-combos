import { useCallback, useMemo, useState } from "react";

type UiOpenStateUpdater = boolean | ((currentOpen: boolean) => boolean);

/** Initialization accepted by {@link useUiOpenState}; `initialOpen` is read only on mount. */
export type UseUiOpenStateOptions = {
  initialOpen?: boolean;
};

type UiOpenState = {
  baselineOpen: boolean;
  canClose: boolean;
  canOpen: boolean;
  canReset: boolean;
  dirty: boolean;
  open: boolean;
};

type UiOpenStateMethods = {
  close: () => void;
  open: () => void;
  rebaseOpen: (open: boolean) => void;
  resetOpen: () => void;
  setOpen: (nextOpen: UiOpenStateUpdater) => void;
  toggle: () => void;
};

/** Stable read model and mutation API returned by {@link useUiOpenState}. */
export type UseUiOpenStateResult = {
  methods: UiOpenStateMethods;
  state: UiOpenState;
};

type UiOpenSnapshot = {
  baselineOpen: boolean;
  open: boolean;
};

const updateOpenSnapshot = (snapshot: UiOpenSnapshot, open: boolean): UiOpenSnapshot =>
  snapshot.open === open ? snapshot : { ...snapshot, open };

/**
 * Owns page-level presentation open state without mirroring a controlled component prop.
 * `rebaseOpen` is the explicit synchronization boundary for replacing current and baseline state.
 */
export function useUiOpenState(options: UseUiOpenStateOptions = {}): UseUiOpenStateResult {
  const [snapshot, setSnapshot] = useState<UiOpenSnapshot>(() => {
    const initialOpen = options.initialOpen ?? false;
    return { baselineOpen: initialOpen, open: initialOpen };
  });

  const setOpen = useCallback((nextOpen: UiOpenStateUpdater) => {
    setSnapshot((current) =>
      updateOpenSnapshot(
        current,
        typeof nextOpen === "function" ? nextOpen(current.open) : nextOpen,
      ),
    );
  }, []);
  const open = useCallback(() => {
    setSnapshot((current) => updateOpenSnapshot(current, true));
  }, []);
  const close = useCallback(() => {
    setSnapshot((current) => updateOpenSnapshot(current, false));
  }, []);
  const toggle = useCallback(() => {
    setSnapshot((current) => updateOpenSnapshot(current, !current.open));
  }, []);
  const resetOpen = useCallback(() => {
    setSnapshot((current) => updateOpenSnapshot(current, current.baselineOpen));
  }, []);
  const rebaseOpen = useCallback((nextOpen: boolean) => {
    setSnapshot((current) =>
      current.open === nextOpen && current.baselineOpen === nextOpen
        ? current
        : { baselineOpen: nextOpen, open: nextOpen },
    );
  }, []);

  const state = useMemo<UiOpenState>(() => {
    const dirty = snapshot.open !== snapshot.baselineOpen;
    return {
      baselineOpen: snapshot.baselineOpen,
      canClose: snapshot.open,
      canOpen: !snapshot.open,
      canReset: dirty,
      dirty,
      open: snapshot.open,
    };
  }, [snapshot]);
  const methods = useMemo<UiOpenStateMethods>(
    () => ({ close, open, rebaseOpen, resetOpen, setOpen, toggle }),
    [close, open, rebaseOpen, resetOpen, setOpen, toggle],
  );

  return useMemo(() => ({ methods, state }), [methods, state]);
}
