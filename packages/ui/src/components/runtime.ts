import type {
  ComponentActionIntent,
  ComponentInteractionReason,
  ComponentValueIntent,
} from "./type";

export const createActionIntent = <Action extends string>(input: {
  action: Action;
  reason: ComponentInteractionReason;
  sourceFocusTarget?: string;
  sourceSurface: string;
}): ComponentActionIntent<Action> => input;

export const createValueIntent = <Value extends string>(input: {
  reason: ComponentInteractionReason;
  sourceFocusTarget?: string;
  sourceSurface: string;
  value: Value;
}): ComponentValueIntent<Value> => input;
