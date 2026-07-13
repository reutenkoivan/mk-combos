import type { z } from "zod/v4";

import type {
  BackupAvailabilitySchema,
  BackupDisclosureStateSchema,
  BackupGameSliceSummarySchema,
  BackupLocalStateSummarySchema,
  BackupOperationStateSchema,
  BackupPersistenceModeSchema,
  BackupSliceStatusSchema,
  BackupValidationMessageToneSchema,
  BackupValidationResultSchema,
  BackupValidationStatusSchema,
  BreadcrumbItemSchema,
  BreadcrumbTargetSchema,
  ComboPresentationSummarySchema,
  ComponentActionDescriptorSchema,
  ComponentAvailabilitySchema,
  ComponentIntentBaseSchema,
  ComponentInteractionReasonSchema,
  ComponentLabelValueSchema,
  ComponentOptionStatusSchema,
  ControllerAccessStateSchema,
  DisplayModeSwitcherOptionSchema,
  GameSwitcherOptionSchema,
  LanguageSwitcherOptionSchema,
  NamedListSummarySchema,
  PickerOptionSchema,
  PickerSlotSchema,
  PickerSlotStatusSchema,
  UiResponsiveModeSchema,
} from "./schema";

export type ComponentInteractionReason = z.output<typeof ComponentInteractionReasonSchema>;
export type UiResponsiveMode = z.output<typeof UiResponsiveModeSchema>;
export type ComponentOptionStatus = z.output<typeof ComponentOptionStatusSchema>;
export type ControllerAccessState = z.output<typeof ControllerAccessStateSchema>;
export type ComponentAvailability = z.output<typeof ComponentAvailabilitySchema>;
export type ComponentActionDescriptor = z.output<typeof ComponentActionDescriptorSchema>;
export type ComponentLabelValue = z.output<typeof ComponentLabelValueSchema>;
export type PickerSlotStatus = z.output<typeof PickerSlotStatusSchema>;
export type PickerSlot = z.output<typeof PickerSlotSchema>;
export type PickerOption = z.output<typeof PickerOptionSchema>;
export type ComboPresentationSummary = z.output<typeof ComboPresentationSummarySchema>;
export type NamedListSummary = z.output<typeof NamedListSummarySchema>;
export type ComponentIntentBase = z.output<typeof ComponentIntentBaseSchema>;
export type GameSwitcherOption = z.output<typeof GameSwitcherOptionSchema>;
export type LanguageSwitcherOption = z.output<typeof LanguageSwitcherOptionSchema>;
export type DisplayModeSwitcherOption = z.output<typeof DisplayModeSwitcherOptionSchema>;
export type BreadcrumbTarget = z.output<typeof BreadcrumbTargetSchema>;
export type BreadcrumbItem = z.output<typeof BreadcrumbItemSchema>;
export type BackupDisclosureState = z.output<typeof BackupDisclosureStateSchema>;
export type BackupPersistenceMode = z.output<typeof BackupPersistenceModeSchema>;
export type BackupOperationState = z.output<typeof BackupOperationStateSchema>;
export type BackupSliceStatus = z.output<typeof BackupSliceStatusSchema>;
export type BackupValidationStatus = z.output<typeof BackupValidationStatusSchema>;
export type BackupValidationMessageTone = z.output<typeof BackupValidationMessageToneSchema>;
export type BackupAvailability = z.output<typeof BackupAvailabilitySchema>;
export type BackupGameSliceSummary = z.output<typeof BackupGameSliceSummarySchema>;
export type BackupLocalStateSummary = z.output<typeof BackupLocalStateSummarySchema>;
export type BackupValidationResult = z.output<typeof BackupValidationResultSchema>;

export type ComponentActionIntent<Action extends string = string> = ComponentIntentBase & {
  action: Action;
};

export type ComponentValueIntent<Value extends string = string> = ComponentIntentBase & {
  value: Value;
};
