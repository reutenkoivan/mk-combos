# UI-CMP-026: Builder Action Bar

## Метадані

- Код: `UI-CMP-026`
- Назва: Builder Action Bar
- Тип: `component / builder actions`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md)

## Призначення

`UI-CMP-026` показує finish, undo, cancel і optional add saved combo actions як компактний command dock builder flow.

## Володіння

`UI-PAGE-006` володіє dirty state, save state, undo availability, finish availability, cancel confirmation і saved combo context. `UI-CMP-026` рендерить controlled action model.

Public module: `@mk-combos/ui/components/builder-action-bar`.

## Анатомія

Action bar є нижнім command dock builder flow. Він має стабільну surface із border/elevation, але не володіє viewport positioning.

```jsx
<BuilderActionBar ui="UI-CMP-026">
  <BuilderActionBarDock>
    <UndoRegion align="start" />
    <SaveStatusLiveRegion align="center" />
    <PrimaryRegion align="end">
      <CancelAction />
      <FinishSaveAction />
      <Show when={hasSavedCombo} replace="FinishSaveAction">
        <AddSavedComboToListAction />
      </Show>
    </PrimaryRegion>
  </BuilderActionBarDock>
</BuilderActionBar>
```

Правила розміщення:

- На `desktop` Undo стоїть зліва, status live region — по центру, Cancel/Confirm Cancel і primary Finish — справа.
- На `mobile` і `tablet` primary Finish займає повну ширину; status іде наступним, а Undo та Cancel/Confirm Cancel формують secondary row нижче.
- Після успішного save `openSavedComboAddToList` замінює Finish у primary slot; дві primary CTA одночасно не показуються.
- Status slot резервує мінімальну висоту навіть без повідомлення, щоб `idle`, `saving`, `saveError` і `saved` не змінювали геометрію dock.
- Status є live region: звичайні та saving/saved повідомлення оголошуються ввічливо, save error — assertive alert.
- Анатомія не вирішує, чи combo валідний; availability приходить із page-level builder flow.
- У canonical builder composition `UI-PAGE-006` завжди володіє `sticky` wrapper, viewport offset і `safe-area-inset-bottom`. Сам `BuilderActionBar` не використовує `position: sticky/fixed`.

## Вхідні дані

- один ordered набір discriminated action descriptors для `undoMove`, `finishBuilder`, `cancelBuilder`, `confirmCancelBuilder` і `openSavedComboAddToList` з `id`, localized label, availability та optional readable reason;
- `dirty`, responsive mode і state: `idle`, `saving`, `saveError` або `saved`;
- optional localized status, saved custom combo id і source surface/focus target.

`saving` робить усі actions inert незалежно від descriptor availability; Finish зберігає primary slot і показує loading feedback. `openSavedComboAddToList` показується тільки для `saved` зі stable saved combo id.

## Вихідні події

- discriminated `undoMove` intent;
- discriminated `finishBuilder` intent;
- discriminated `cancelBuilder` або `confirmCancelBuilder` intent;
- discriminated `openSavedComboAddToList` intent.

Payload містить action descriptor id, `dirty`, optional saved combo id, reason, source surface і source focus target. Компонент не відкриває cancel confirmation самостійно: page передає descriptor потрібної cancel action.

## Межі відповідальності

Компонент не зберігає custom combo, не пише localStorage, не валідить graph і не читає controller input напряму.

## Критерії приймання

- Busy/disabled states controlled сторінкою; `saving` блокує весь action set.
- Cancel confirmation не запускається без page intent.
- Actions емітять semantic payload.
- Desktop і compact layouts зберігають одну action hierarchy: Undo secondary, Finish/saved CTA primary, Cancel destructive secondary.
- Dock має видимі border/elevation і стабільний status slot, але не захоплює page-owned sticky/safe-area behavior.
- Primary та compact controls мають visible hover/focus/loading/disabled feedback; mobile/tablet targets не менші за `44×44px`.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
