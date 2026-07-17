import type { UiFocusNavigationScope } from "@mk-combos/ui/focus-navigation/type";

export type SettingsControllerFocusRowTarget = Readonly<{
  disabled?: boolean;
  id: string;
}>;

type CreateSettingsControllerFocusScopeInput = Readonly<{
  entryTargetId: string;
  fallbackTargetId: string;
  id: string;
  rows: readonly (readonly SettingsControllerFocusRowTarget[])[];
}>;

function targetAtColumn(
  rows: readonly (readonly SettingsControllerFocusRowTarget[])[],
  rowIndex: number,
  columnIndex: number,
): string | undefined {
  const row = rows[rowIndex];

  if (row === undefined || row.length === 0) {
    return undefined;
  }

  return row[Math.min(columnIndex, row.length - 1)]?.id;
}

/** Builds a deterministic row graph without reading DOM geometry. */
export function createSettingsControllerFocusScope(
  input: CreateSettingsControllerFocusScopeInput,
): UiFocusNavigationScope {
  const rows = input.rows.filter((row) => row.length > 0);

  return {
    availableCommandIds: [],
    entryTargetId: input.entryTargetId,
    fallbackTargetId: input.fallbackTargetId,
    id: input.id,
    targets: rows.flatMap((row, rowIndex) =>
      row.map((target, columnIndex) => ({
        disabled: target.disabled,
        id: target.id,
        neighbors: {
          down: targetAtColumn(rows, rowIndex + 1, columnIndex),
          left: row[columnIndex - 1]?.id,
          right: row[columnIndex + 1]?.id,
          up: targetAtColumn(rows, rowIndex - 1, columnIndex),
        },
      })),
    ),
  };
}
