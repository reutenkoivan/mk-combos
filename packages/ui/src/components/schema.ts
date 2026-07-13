import { ComboRefSchema } from "@mk-combos/contracts/identity/schema";
import {
  LanguageCodeSchema,
  NotationDisplayModeSchema,
} from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { UiToneModeSchema } from "../tokens/schema";

import {
  backupDisclosureStates,
  backupOperationStates,
  backupPersistenceModes,
  backupSliceStatuses,
  backupValidationMessageTones,
  backupValidationStatuses,
  componentInteractionReasons,
  componentOptionStatuses,
  controllerAccessStates,
  pickerSlotStatuses,
  uiResponsiveModes,
} from "./value";

export const ComponentInteractionReasonSchema = z.enum(componentInteractionReasons);
export const UiResponsiveModeSchema = z.enum(uiResponsiveModes);
export const ComponentOptionStatusSchema = z.enum(componentOptionStatuses);
export const ControllerAccessStateSchema = z.enum(controllerAccessStates);
export const PickerSlotStatusSchema = z.enum(pickerSlotStatuses);

export const ComponentAvailabilitySchema = z
  .object({
    available: z.boolean(),
    disabledReason: z.string().min(1).optional(),
  })
  .strict();

export const ComponentActionDescriptorSchema = z
  .object({
    available: z.boolean(),
    disabledReason: z.string().min(1).optional(),
    id: z.string().min(1),
    label: z.string().min(1),
    tone: UiToneModeSchema.optional(),
  })
  .strict();

export const ComponentLabelValueSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    tone: UiToneModeSchema.optional(),
    value: z.string().min(1),
  })
  .strict();

export const PickerSlotSchema = z
  .object({
    column: z.number().int().positive(),
    optionId: z.string().min(1).optional(),
    responsiveOrder: z.number().int().positive().optional(),
    row: z.number().int().positive(),
    slotId: z.string().min(1),
    status: PickerSlotStatusSchema,
  })
  .strict();

export const PickerOptionSchema = z
  .object({
    count: z.number().int().nonnegative().optional(),
    description: z.string().min(1).optional(),
    disabledReason: z.string().min(1).optional(),
    id: z.string().min(1),
    imageAlt: z.string().min(1).optional(),
    imageSrc: z.string().min(1).optional(),
    label: z.string().min(1),
    shortLabel: z.string().min(1).optional(),
  })
  .strict();

export const ComboPresentationSummarySchema = z
  .object({
    accessibleLabel: z.string().min(1),
    contextItems: z.array(ComponentLabelValueSchema).readonly(),
    membershipHint: z.string().min(1).optional(),
    metadataItems: z.array(ComponentLabelValueSchema).readonly(),
    notation: z.array(z.array(z.string().min(1)).readonly()).readonly(),
    notesSnippet: z.string().min(1).optional(),
    ref: ComboRefSchema,
    title: z.string().min(1),
  })
  .strict();

export const NamedListSummarySchema = z
  .object({
    id: z.string().min(1),
    itemCount: z.number().int().nonnegative(),
    name: z.string().min(1),
    updatedLabel: z.string().min(1).optional(),
  })
  .strict();

export const ComponentIntentBaseSchema = z
  .object({
    reason: ComponentInteractionReasonSchema,
    sourceFocusTarget: z.string().min(1).optional(),
    sourceSurface: z.string().min(1),
  })
  .strict();

export const GameSwitcherOptionSchema = z
  .object({
    description: z.string().min(1).optional(),
    disabledReason: z.string().min(1).optional(),
    gameId: z.string().min(1),
    label: z.string().min(1),
    shortLabel: z.string().min(1).optional(),
    status: ComponentOptionStatusSchema,
  })
  .strict();

export const LanguageSwitcherOptionSchema = z
  .object({
    description: z.string().min(1).optional(),
    disabledReason: z.string().min(1).optional(),
    label: z.string().min(1),
    language: LanguageCodeSchema,
    shortLabel: z.string().min(1).optional(),
    status: ComponentOptionStatusSchema,
  })
  .strict();

export const DisplayModeSwitcherOptionSchema = z
  .object({
    description: z.string().min(1).optional(),
    disabledReason: z.string().min(1).optional(),
    label: z.string().min(1),
    mode: NotationDisplayModeSchema,
    shortLabel: z.string().min(1).optional(),
    status: ComponentOptionStatusSchema,
  })
  .strict();

export const BreadcrumbTargetSchema = z
  .object({
    params: z.record(z.string(), z.string()).optional(),
    route: z.string().min(1).optional(),
    surfaceCode: z.string().min(1),
  })
  .strict();

export const BreadcrumbItemSchema = z
  .object({
    current: z.boolean(),
    disabled: z.boolean(),
    disabledReason: z.string().min(1).optional(),
    id: z.string().min(1),
    kind: z.string().min(1),
    label: z.string().min(1),
    target: BreadcrumbTargetSchema.optional(),
    truncationLabel: z.string().min(1).optional(),
  })
  .strict();

export const BackupDisclosureStateSchema = z.enum(backupDisclosureStates);
export const BackupPersistenceModeSchema = z.enum(backupPersistenceModes);
export const BackupOperationStateSchema = z.enum(backupOperationStates);
export const BackupSliceStatusSchema = z.enum(backupSliceStatuses);
export const BackupValidationStatusSchema = z.enum(backupValidationStatuses);
export const BackupValidationMessageToneSchema = z.enum(backupValidationMessageTones);

export const BackupAvailabilitySchema = z
  .object({ available: z.boolean(), disabledReason: z.string().min(1).optional() })
  .strict();

export const BackupGameSliceSummarySchema = z
  .object({
    customComboCount: z.number().int().nonnegative().optional(),
    gameId: z.string().min(1),
    label: z.string().min(1),
    namedListCount: z.number().int().nonnegative().optional(),
    staleOrInvalidCount: z.number().int().nonnegative().optional(),
    status: BackupSliceStatusSchema,
  })
  .strict();

export const BackupLocalStateSummarySchema = z
  .object({
    gameSlices: z.array(BackupGameSliceSummarySchema).readonly(),
    lastExportedAt: z.string().min(1).optional(),
    persistenceMode: BackupPersistenceModeSchema,
    settingsSummary: z.string().min(1),
    totalCustomCombos: z.number().int().nonnegative().optional(),
    totalNamedLists: z.number().int().nonnegative().optional(),
  })
  .strict();

export const BackupValidationMessageSchema = z
  .object({
    gameId: z.string().min(1),
    message: z.string().min(1),
    tone: BackupValidationMessageToneSchema,
  })
  .strict();

export const BackupValidationResultSchema = z
  .object({
    gameSliceMessages: z.array(BackupValidationMessageSchema).readonly().optional(),
    message: z.string().min(1).optional(),
    status: BackupValidationStatusSchema,
  })
  .strict();
