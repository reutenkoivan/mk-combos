import { z } from "zod/v4";

import {
  mk1CatalogContextStatuses,
  mk1CatalogRecoveryCodes,
  mk1CatalogRouteQueryKeys,
} from "./value";

const CatalogIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

const PlainRouteValueSchema = z.union([z.string(), z.array(z.string()).readonly()]);

const createMk1CatalogRouteQuerySchema = () =>
  z
    .object({
      character: PlainRouteValueSchema.optional(),
      kameo: PlainRouteValueSchema.optional(),
      starter: PlainRouteValueSchema.optional(),
      position: PlainRouteValueSchema.optional(),
      meter: PlainRouteValueSchema.optional(),
      damageMin: PlainRouteValueSchema.optional(),
      damageMax: PlainRouteValueSchema.optional(),
      difficulty: PlainRouteValueSchema.optional(),
      routeType: PlainRouteValueSchema.optional(),
      tag: PlainRouteValueSchema.optional(),
    })
    .strict();

export const Mk1CatalogContextStatusSchema = z.enum(mk1CatalogContextStatuses);

export const Mk1CatalogRecoveryCodeSchema = z.enum(mk1CatalogRecoveryCodes);

export const Mk1CatalogRouteQueryKeySchema = z.enum(mk1CatalogRouteQueryKeys);

export const Mk1CatalogContextSchema = z
  .object({
    characterId: CatalogIdSchema.optional(),
    kameoId: CatalogIdSchema.optional(),
  })
  .strict();

export const Mk1CatalogRequiredContextSchema = z
  .object({
    characterId: CatalogIdSchema,
    kameoId: CatalogIdSchema,
  })
  .strict();

export const Mk1CatalogPlainRouteQuerySchema = createMk1CatalogRouteQuerySchema();

export const Mk1CatalogRouteQuerySchema = createMk1CatalogRouteQuerySchema();

export {
  mk1CatalogContextStatuses,
  mk1CatalogRecoveryCodes,
  mk1CatalogRouteQueryKeys,
} from "./value";
