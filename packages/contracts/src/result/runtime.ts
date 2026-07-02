import type { AppErr, AppError, AppOk } from "./type";

export function ok<T>(value: T): AppOk<T> {
  return { ok: true, value };
}

export function err<E extends AppError>(error: E): AppErr<E> {
  return { ok: false, error };
}
