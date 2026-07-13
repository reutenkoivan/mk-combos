import { cx } from "../recipes/class-name";
import { CharacterPicker, type CharacterPickerProps } from "./character-picker";
import { FilterControlGroup, type FilterControlGroupProps } from "./filter-control-group";
import { KameoPicker, type KameoPickerProps } from "./kameo-picker";
import type { ComponentActionIntent, UiResponsiveMode } from "./type";
import { uiResponsiveModes } from "./value";
import { VariationPicker, type VariationPickerProps } from "./variation-picker";

export const comboListConfigModuleActions = {
  clearFilters: "clearFilters",
  closeFilterGroup: "closeFilterGroup",
  removeActiveFilter: "removeActiveFilter",
  returnFocusToCatalog: "returnFocusToCatalog",
  selectCharacter: "selectCharacter",
  selectGameContext: "selectGameContext",
  toggleFilterGroup: "toggleFilterGroup",
  updateOptionalFilter: "updateOptionalFilter",
} as const;

export type ComboListConfigModuleAction =
  (typeof comboListConfigModuleActions)[keyof typeof comboListConfigModuleActions];

export type ComboListConfigModuleIntent = ComponentActionIntent<ComboListConfigModuleAction>;

export const comboListConfigPickerKinds = {
  kameo: "kameo",
  variation: "variation",
} as const;

export type ComboListConfigPickerKind =
  (typeof comboListConfigPickerKinds)[keyof typeof comboListConfigPickerKinds];

export type ComboListConfigGameContextPicker =
  | {
      kind: typeof comboListConfigPickerKinds.kameo;
      props: Omit<KameoPickerProps, "responsiveMode">;
    }
  | {
      kind: typeof comboListConfigPickerKinds.variation;
      props: Omit<VariationPickerProps, "responsiveMode">;
    };

export type ComboListConfigModuleProps = {
  characterPicker: Omit<CharacterPickerProps, "responsiveMode">;
  filterGroup: FilterControlGroupProps;
  gameContextPicker?: ComboListConfigGameContextPicker;
  responsiveMode: UiResponsiveMode;
};

function renderGameContextPicker(
  picker: ComboListConfigGameContextPicker,
  responsiveMode: UiResponsiveMode,
) {
  switch (picker.kind) {
    case comboListConfigPickerKinds.kameo:
      return <KameoPicker {...picker.props} responsiveMode={responsiveMode} />;
    case comboListConfigPickerKinds.variation:
      return <VariationPicker {...picker.props} responsiveMode={responsiveMode} />;
  }

  const unhandledPicker: never = picker;
  return unhandledPicker;
}

export function ComboListConfigModule(props: ComboListConfigModuleProps) {
  const compact = props.responsiveMode !== uiResponsiveModes.desktop;

  return (
    <section className="grid min-w-0 gap-4" data-ui-component="UI-CMP-012">
      <div
        className={cx("grid min-w-0 gap-4", compact ? "grid-cols-1" : "grid-cols-2 items-start")}
        data-ui-config-context-row
      >
        <CharacterPicker {...props.characterPicker} responsiveMode={props.responsiveMode} />
        {props.gameContextPicker
          ? renderGameContextPicker(props.gameContextPicker, props.responsiveMode)
          : null}
      </div>
      <FilterControlGroup {...props.filterGroup} />
    </section>
  );
}

ComboListConfigModule.displayName = "ComboListConfigModule";
