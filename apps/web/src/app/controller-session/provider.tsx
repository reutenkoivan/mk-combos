import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { createControllerSession } from "./runtime";
import type {
  ControllerCommandRibbonModel,
  ControllerCommandScope,
  ControllerCommandScopeRegistration,
  ControllerSession,
  ControllerSessionObservableState,
  ControllerSessionProviderProps,
  ControllerSessionSource,
} from "./type";

const ControllerSessionContext = createContext<ControllerSession | undefined>(undefined);
const useControllerScopeLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

function useControllerSession(): ControllerSession {
  const session = useContext(ControllerSessionContext);

  if (session === undefined) {
    throw new Error("Controller session hooks must be used within ControllerSessionProvider");
  }

  return session;
}

export function ControllerSessionProvider({
  children,
  environment,
}: ControllerSessionProviderProps) {
  const [session] = useState(() => createControllerSession({ environment }));

  useEffect(() => {
    session.start();

    return session.stop;
  }, [session]);

  return <ControllerSessionContext value={session}>{children}</ControllerSessionContext>;
}

function useControllerSessionSource(): ControllerSessionSource {
  return useControllerSession().source;
}

export function useControllerSessionObservableState(): ControllerSessionObservableState {
  const session = useControllerSession();

  return useSyncExternalStore(
    session.subscribe,
    session.getObservableState,
    session.getObservableState,
  );
}

export function useControllerCommandRibbonModel(): ControllerCommandRibbonModel | null {
  const session = useControllerSession();

  return useSyncExternalStore(
    session.subscribeCommandRibbon,
    session.getCommandRibbonModel,
    session.getCommandRibbonModel,
  );
}

export function useControllerCommandScope(scope: ControllerCommandScope): void {
  const source = useControllerSessionSource();
  const committedScope = useRef(scope);
  const registration = useRef<ControllerCommandScopeRegistration | undefined>(undefined);
  const handleCommand = useCallback(
    (event: Parameters<ControllerCommandScope["handleCommand"]>[0]) =>
      committedScope.current.handleCommand(event),
    [],
  );

  useControllerScopeLayoutEffect(() => {
    committedScope.current = scope;
  });

  useControllerScopeLayoutEffect(() => {
    const scopeId = scope.id;
    const scopeLayer = scope.layer;
    const currentScope = committedScope.current;
    const currentRegistration = source.registerCommandScope({
      ...currentScope,
      handleCommand,
      id: scopeId,
      layer: scopeLayer,
    });

    registration.current = currentRegistration;

    return () => {
      if (registration.current === currentRegistration) {
        registration.current = undefined;
      }

      currentRegistration.unregister();
    };
  }, [handleCommand, scope.id, scope.layer, source]);

  useControllerScopeLayoutEffect(() => {
    const currentScope = committedScope.current;

    registration.current?.update({
      ...currentScope,
      handleCommand,
      id: scope.id,
      layer: scope.layer,
    });
  });
}

ControllerSessionProvider.displayName = "ControllerSessionProvider";
