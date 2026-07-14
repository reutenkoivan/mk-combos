import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { createLocalStateStore, type LocalStateStore } from "./store";
import type { LocalStateObservableState, LocalStateProviderProps, LocalStateSource } from "./type";
import { htmlLanguageByAppLanguage } from "./value";

const LocalStateStoreContext = createContext<LocalStateStore | undefined>(undefined);

function useLocalStateStore(): LocalStateStore {
  const store = useContext(LocalStateStoreContext);

  if (store === undefined) {
    throw new Error("Local state hooks must be used within LocalStateProvider");
  }

  return store;
}

export function LocalStateProvider({ children, environment }: LocalStateProviderProps) {
  const [store] = useState(() => createLocalStateStore({ environment }));
  const appliedLanguage = useStore(store, (state) => state.observable.appliedSettings.language);

  useEffect(() => store.getState().hydrate(), [store]);
  useEffect(() => {
    document.documentElement.lang = htmlLanguageByAppLanguage[appliedLanguage];
  }, [appliedLanguage]);

  return <LocalStateStoreContext value={store}>{children}</LocalStateStoreContext>;
}

export function useLocalStateSource(): LocalStateSource {
  return useLocalStateStore().getState().source;
}

export function useLocalStateObservableState(): LocalStateObservableState {
  const store = useLocalStateStore();

  return useStore(store, (state) => state.observable);
}

LocalStateProvider.displayName = "LocalStateProvider";
