import { useCallback, useId, useMemo } from "react";

/** Prepared validation state and optional explicit association id for one field message. */
export type UseFieldMessageOptions = {
  hasMessage: boolean;
  id?: string;
  invalid?: boolean;
};

type FieldMessageControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

type FieldMessageElementProps = {
  id: string;
  invalid?: true;
};

type FieldMessageState = {
  describedBy?: string;
  hasMessage: boolean;
  invalid: boolean;
  messageId: string;
};

/** Stable association state and memoized ARIA/field-message bindings. */
export type UseFieldMessageResult = {
  methods: {
    getControlProps: () => FieldMessageControlProps;
    getMessageProps: () => FieldMessageElementProps;
  };
  state: FieldMessageState;
};

/**
 * Owns stable accessibility bindings between a field control and its prepared message.
 * Validation copy and the decision to expose a message remain owned by the caller.
 */
export function useFieldMessage(options: UseFieldMessageOptions): UseFieldMessageResult {
  const generatedId = useId();
  const messageId = options.id ?? `ui-field-${generatedId}-message`;
  const invalid = options.invalid === true;
  const describedBy = options.hasMessage ? messageId : undefined;
  const controlProps = useMemo<FieldMessageControlProps>(
    () => ({
      "aria-describedby": describedBy,
      "aria-invalid": invalid ? true : undefined,
    }),
    [describedBy, invalid],
  );
  const messageProps = useMemo<FieldMessageElementProps>(
    () => ({ id: messageId, invalid: invalid ? true : undefined }),
    [invalid, messageId],
  );
  const getControlProps = useCallback(() => controlProps, [controlProps]);
  const getMessageProps = useCallback(() => messageProps, [messageProps]);
  const state = useMemo<FieldMessageState>(
    () => ({ describedBy, hasMessage: options.hasMessage, invalid, messageId }),
    [describedBy, invalid, messageId, options.hasMessage],
  );
  const methods = useMemo(
    () => ({ getControlProps, getMessageProps }),
    [getControlProps, getMessageProps],
  );

  return useMemo(() => ({ methods, state }), [methods, state]);
}
