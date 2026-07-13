# UI-CMP-013: Filter Control Group

## Метадані

- Код: `UI-CMP-013`
- Назва: `Filter Control Group`
- Тип: `component / catalog filters`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Батьківський компонент: [`UI-CMP-012 Combo List Config Module`](./UI-CMP-012.md)
- Variant docs: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Пов'язані UX сценарії: `US-006`, `US-019`

## Призначення

`UI-CMP-013 Filter Control Group` є єдиним collapsible компонентом optional filters у Catalog.

Компонент об'єднує:

- header із expand/collapse trigger, result count, active optional-filter chips і `Clear filters`;
- body із controls для optional filter facets.

За замовчуванням `UI-CMP-013` рендериться у стані `expanded` під час fresh Catalog entry і context-ready render. Якщо користувач collapse-ить компонент, це діє тільки в межах поточної Catalog surface session і не змінює selected filters.

Optional filters застосовуються live. Explicit `Apply` не є частиною основного UX.

Available facets, result count і compatibility messages приходять із active game catalog business. Компонент не обчислює game-specific filter semantics.

## Роль і межі

`UI-CMP-013` відповідає за:

- показ result count для current required context і selected optional filters;
- показ active optional-filter chips у header;
- remove control для кожного active chip;
- `Clear filters` для optional filters;
- рендер controlled collapsible state filter group;
- показ optional facet controls у body;
- передачу semantic filter update intents у `UI-CMP-012` або Catalog.

`UI-CMP-013` не відповідає за:

- вибір character, variation або kameo;
- зміну app-level `game`, `language` або `notation display mode`;
- читання game-owned combo data напряму;
- обчислення visible combo list самостійно; active game business володіє selectors;
- відкриття combo detail;
- запис route state, localStorage або user data напряму.

`UI-CMP-013` не володіє expanded/collapsed source of truth. Якщо filter mechanics винесені в custom hook, hook викликається в Catalog page flow, а компонент отримує prepared filter model і handlers як props.

## Анатомія

Розміщення є collapsible filter block: header завжди зверху і видимий, body розташований під ним тільки коли parent передав expanded model.

```jsx
<FilterControlGroup ui="UI-CMP-013">
  <FilterControlRegion slot="UI-CMP-012">
    <Stack name="FilterLayout">
      <FilterHeader>
        <Stack name="FilterHeaderLayout">
          <Group name="FilterHeaderMainRow">
            <ExpandCollapseTrigger />
            <ResultCount />
            <ClearFiltersControl />
          </Group>

          <ActiveOptionalFilterChips />
        </Stack>
      </FilterHeader>

      <Show when={filterGroupExpanded}>
        <FilterBody>
          <OptionalFacetControls>
            <Stack name="OptionalFacetList">
              <StarterFacet />
              <PositionFacet />
              <MeterFacet />
              <DamageFacet />
              <DifficultyFacet />
              <RouteTypeFacet />
              <TagsFacet />

              <Show when={activeGame === "MKXL"}>
                <StageFacet />
                <InteractableFacet />
              </Show>
            </Stack>
          </OptionalFacetControls>
        </FilterBody>
      </Show>
    </Stack>
  </FilterControlRegion>
</FilterControlGroup>
```

Правила розміщення:

- Header лишається над body у `expanded` і `collapsed` states.
- Active chips стоять у header, щоб applied filters лишалися видимими навіть коли body collapsed.
- Facets у body читаються у prepared order; game-specific facets стоять після shared facets.

### `filterHeader`

`filterHeader` лишається видимим у `expanded` і `collapsed` states.

Header містить:

- expand/collapse trigger із readable expanded/collapsed state;
- result count для combos, які відповідають current required context і selected optional filters;
- chips для active optional filter values;
- `Clear filters`, якщо один або більше optional filters застосовані.

Кожен active chip має:

- readable label;
- remove control;
- accessible name на кшталт `Remove meter filter`;
- stable size, щоб список не стрибав під час hover або focus.

Removing chip прибирає тільки відповідний optional filter value і не скидає required context.

### `filterBody`

`filterBody` показується тільки у `expanded` state.

Body містить optional facets:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags;
- `MKXL` only: stage;
- `MKXL` only: interactable.

`MK1` не показує `variation`, stage або interactable controls у `UI-CMP-013`. `MKXL` не показує `kameo`.

`character`, `variation` і `kameo` не дублюються як optional filter facets. Вони належать `contextRow` у `UI-CMP-012`.

## Interface Contract

### Inputs

- selected optional filters;
- available optional facets;
- result count;
- expanded або collapsed state, default `expanded`;
- loading або disabled state;
- validation або compatibility message;
- controller focus state.

### Outputs

- `requestUpdateOptionalFilter(payload)`;
- `requestRemoveActiveFilter(payload)`;
- `requestClearFilters(payload)`;
- `requestToggleFilterGroup(payload)`;
- `requestCloseFilterGroup(payload)`;
- `requestReturnFocusToCatalog(payload)`.

Output payloads містять filter id/value/reason/source focus target і не містять browser event objects.

### State Tokens

- `filterGroupExpanded`: filter body показаний; default state для fresh Catalog entry і context-ready render.
- `filterGroupCollapsed`: показаний тільки header; selected filters лишаються active.
- `filterActive`: один або більше optional filters застосовані.
- `loadingFacets`: optional facets або counts ще готуються.
- `noFilterResults`: selected optional filters не повернули combo для current required context.
- `invalidDependentFilter`: selected stage/interactable або інший dependent filter більше не сумісний з upstream filter.

Deprecated для основного v1 UX:

- `dirty`;
- explicit `apply filters`;
- draft/applied split для ordinary optional filter changes.

## UI Behavior

### Default Expanded

`UI-CMP-013` відкривається expanded за замовчуванням:

- після fresh Catalog entry;
- після valid context-ready render;
- після route або page transition у Catalog, якщо немає surface-session collapse state.

User collapse не очищає filters і не зберігається як app-level setting.

### Live Filtering

Optional filters застосовуються live:

1. Користувач змінює optional filter.
2. `UI-CMP-013` емітить update event.
3. Catalog перераховує visible combo list.
4. Result count і active chips оновлюються.
5. Якщо result count дорівнює `0`, Catalog переходить у `noFilterResults`.

### Clear Filters

`Clear filters` очищає:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags;
- `MKXL` stage/interactable filters.

`Clear filters` не очищає:

- selected character;
- selected `MKXL` variation;
- selected `MK1` kameo;
- app-level settings;
- route context.

## Controller Behavior

`UI-CMP-013` отримує semantic commands через `UI-CMP-012` або Catalog і не читає Browser Gamepad API напряму.

Commands:

- `openFilters`: фокусує `UI-CMP-013`, лишає або переводить group у `filterGroupExpanded`, ставить focus на перший active або available filter.
- `navLeft` / `navRight`: рух між header controls або options у focused filter group.
- `navUp` / `navDown`: рух між header, filter body controls, `contextRow` і `UI-CMP-010 Combo List`.
- `confirm`: toggles focused filter value або expand/collapse trigger; зміна filter value застосовується live.
- `back`: якщо focus у body, collapse-ить group і повертає focus на header trigger.
- `closePanel`: collapse-ить group і повертає focus на header trigger.
- contextual `clearFilters`: очищає optional filters без скидання selected context.

Guard rails:

- Поки focus у expanded filter body або picker/listbox open, combo list не отримує `confirm`, `openDetail` або `addToList`.
- Controller commands не мають вибирати filters, яких немає у current options.
- `openFilters` не створює modal focus trap.

## Accessibility

- Expand/collapse trigger має `aria-expanded`, що відповідає `filterGroupExpanded` або `filterGroupCollapsed`.
- Result count оголошується через polite live region, якщо зміна впливає на task completion.
- Filter groups мають semantic grouping і readable labels.
- Кожен chip remove control має accessible name.
- `Clear filters` має visible label або accessible name.
- Invalid dependent filter має видимий і програмний invalid/error relationship.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Розміщення має лишатися usable на mobile/narrow viewport: header, chips, result count, body controls і combo list не overlap-яться.

## Acceptance Criteria

- `UI-CMP-013` має окремий повний spec.
- `UI-CMP-012` рендерить `UI-CMP-013` як єдиний optional filter component.
- `UI-CMP-013` default state є `filterGroupExpanded`.
- Header містить expand/collapse trigger, result count, active optional-filter chips і `Clear filters`.
- Body містить optional facet controls.
- Clear filters не скидає character + variation/kameo.
- Optional filters застосовуються live без `Apply`.
- `openFilters`, `back` і `closePanel` працюють з collapsible group і не тригерять combo card actions у background.

## Test Scenarios

- Fresh Catalog із valid context показує `UI-CMP-013` expanded.
- Collapse приховує body, але лишає header, chips і result count видимими.
- Optional filters live-фільтрують combo list.
- Result count оновлюється після зміни optional filters.
- Active chip remove прибирає тільки відповідний filter.
- `Clear filters` прибирає optional filters і зберігає selected character + variation/kameo.
- Stage change у MKXL прибирає incompatible interactable.
- No-results показує recovery action.
- Controller `openFilters`, `back`, `closePanel` не тригерять combo card actions у background.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
