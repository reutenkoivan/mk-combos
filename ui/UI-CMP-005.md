# UI-CMP-005: Controller Hint Strip

## Метадані

- Код: `UI-CMP-005`
- Назва: `Controller Hint Strip`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: `UI-CMP-001 Global Top Bar`
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані UX сценарії: `US-019`, `US-020`, `US-021`, `US-022`

## Призначення

`UI-CMP-005 Controller Hint Strip` є controller status та contextual command surface у межах `UI-CMP-001 Global Top Bar`.

За замовчуванням компонент показує тільки indicator:

- якщо controller підключено: controller icon із `success` tone;
- якщо controller щойно від'єднано: той самий controller icon із `warning` tone та dashed stroke протягом 1 хвилини;
- якщо controller не підключено і немає active disconnect grace window: компонент не відображається.

Closed trigger не показує status dot, profile label або інший visible text. Його accessible name надходить через localized `label`.

Найважливіші доступні commands показуються автоматично: як bottom ribbon у `mobile` та inline ribbon у `tablet`/`desktop`. Повний hint panel відкривається через focused indicator або `openControllerHelp`; pointer і keyboard лишаються secondary inputs, але не є вимогою.

## Володіння

`UI-CMP-005` завжди рендериться всередині `UI-CMP-001 Global Top Bar`.

`UI-CMP-001` контролює:

- позицію indicator у Top Bar;
- visible або hidden state;
- open або closed state hint panel;
- responsive wrapping;
- relationship із navigation actions Top Bar.

`UI-CMP-005` не позиціонується самостійно в shell layout і не є direct child `UI-PAGE-001 App Shell`.

## Анатомія

Розміщення має compact indicator у Top Bar і conditional hint panel, який відкривається під/поруч із trigger без переміщення global navigation.

```jsx
<ControllerHintStrip ui="UI-CMP-005">
  <ControllerIndicatorSurface slot="UI-CMP-001 ControllerStatusSlot">
    <ControllerIconTrigger size="28px" iconSize="16px" />

    <Show when={hintPanelState === "open"}>
      <HintPanelOverlay>
        <Stack name="HintPanelContent">
          <ControllerStatusHeader>
            <ControllerProfileTitle />
            <ConnectionStatusText />
          </ControllerStatusHeader>
          <Separator />
          <ActiveSurfaceCommandList ordered />

          <Show when={hasControllerHelpAction}>
            <ControllerHelpAction />
          </Show>
        </Stack>
      </HintPanelOverlay>
    </Show>
  </ControllerIndicatorSurface>
</ControllerHintStrip>
```

Правила розміщення:

- `IndicatorSurface` стоїть outside `UI-CMP-033` і не переноситься в dropdown menu.
- Trigger має стабільний розмір `28×28 px`; controller SVG має розмір `16×16 px` у closed і open states.
- Hint panel відкривається від trigger як overlay/anchored surface; його visibility, open/closed state і localized hint model приходять із `UI-CMP-001` / App Shell inputs.
- Hint panel має максимальну ширину `20rem` і не змінює геометрію Top Bar.
- Command labels усередині panel читаються згори вниз у тому порядку, який підготував controller command model.

## Вхідні дані

- `controllerConnectionState`: стан підключення controller.
- `activeControllerProfile`: active profile, наприклад DualSense, Xbox або Standard Gamepad fallback.
- `activeSurfaceCode`: code активної UI-поверхні.
- `localizedHints`: localized labels і descriptions для доступних controller commands.
- `lastDisconnectedAt`: timestamp останнього disconnect event, якщо controller був підключений раніше.
- `hasRecentDisconnect`: boolean, якщо 1-minute disconnect grace window обчислюється вище.
- `hintPanelState`: `closed` або `open`.

## Вихідні події

- `requestOpenHints`: користувач просить відкрити hint panel.
- `requestCloseHints`: користувач просить закрити hint panel.
- `requestToggleHints`: користувач просить перемкнути hint panel.
- `requestControllerHelp`: optional запит відкрити controller help, якщо така UI-поверхня буде додана.

`UI-CMP-005` не емітить navigation, builder, filter або list commands. Він може емітити тільки UI-запити, які стосуються indicator або hint panel.

## Межі відповідальності

Компонент відповідає за:

- показ connected indicator;
- показ disconnect grace indicator протягом 1 хв після disconnect;
- приховування себе, коли controller не підключено і grace window завершено;
- відкриття hint panel після взаємодії з indicator;
- показ profile-specific button labels у hint panel;
- показ contextual hints для active surface у hint panel.

Компонент не відповідає за:

- читання Browser Gamepad API;
- нормалізацію buttons або axes;
- мапінг physical input у semantic commands;
- виконання controller commands;
- зміну app routing;
- зміну state активної сторінки;
- persistence open або closed state hint panel.

## Мапа станів

### `hiddenNoController`

Controller не підключено, і немає active 1-minute disconnect grace window.

Очікуваний UI:

- `UI-CMP-005` не відображається;
- Top Bar не резервує окреме місце під indicator;
- keyboard/mouse flow не змінюється.

### `connectedIndicator`

Controller підключено.

Очікуваний UI:

- показано тільки controller icon із `success` tone;
- indicator має localized accessible name про стан підключення;
- profile label і status dot у trigger не рендеряться;
- hint panel лишається закритим, поки користувач не взаємодіє з indicator.

### `disconnectGraceIndicator`

Controller від'єднано після активного підключення, і з disconnect event минуло менше або рівно 1 хвилини.

Очікуваний UI:

- показано той самий controller icon із `warning` tone;
- dashed stroke є structural ознакою disconnect state, незалежною від кольору;
- indicator має accessible text про втрату з'єднання;
- hint panel лишається закритим, поки користувач не взаємодіє з indicator.

Після завершення 1 хвилини компонент переходить у `hiddenNoController`, якщо controller не reconnect.

### `hintPanelClosed`

Indicator видимий, але hint panel закритий.

Очікуваний UI:

- visible state є `connectedIndicator` або `disconnectGraceIndicator`;
- повний список hints не показується;
- indicator доступний як icon-only button;
- trigger не показує profile label, status dot або connection text.

### `hintPanelOpen`

Користувач відкрив hint panel через indicator.

Очікуваний UI:

- trigger зберігає controller hit area, лишається transparent без border/background, а open state передає accent icon та зовнішній focus ring;
- hint panel header показує profile label або підготовлений fallback і visible connection status;
- після separator hint panel показує ordered contextual hints для active surface;
- кожен hint може містити input badge, label і optional description;
- panel прив'язаний до indicator у `UI-CMP-001 Global Top Bar`;
- `Escape` закриває panel;
- focus повертається на indicator після закриття.

## Правила відображення

### Базова видимість

- Немає controller і немає recent disconnect: не показувати компонент.
- Controller підключено: показати controller icon із `success` tone.
- Controller disconnected після active connection: показати controller icon із `warning` tone та dashed stroke протягом 1 хв.
- Controller reconnect під час 1-minute window: одразу повернути normal `success` stroke.

### Відкриття hint panel

Hint panel відкривається тільки через взаємодію з indicator:

- click;
- tap;
- keyboard activation `Enter`;
- keyboard activation `Space`.

Hover сам по собі не відкриває hint panel.

### Навігаційні поверхні

У відкритому hint panel для загальної навігації показувати:

- directional navigation: `navUp`, `navDown`, `navLeft`, `navRight`;
- primary action: `confirm`;
- назад або закрити: `back`;
- contextual menu/action, якщо доступний у surface.

### Списки та сторінки деталей

У відкритому hint panel для catalog, combo list, named list і detail surfaces показувати тільки актуальні commands:

- `openDetail`, якщо focus на combo item;
- `addToList`, якщо focus на `UI-CMP-011 Combo Card` і combo можна додати в list; команда просить активну сторінку відкрити singleton `UI-CMP-021`;
- `removeFromList`, якщо item уже в list context;
- `openActions`, якщо є contextual actions menu;
- `back`, якщо detail або panel можна закрити.

### Конфігурація combo list і меню дій

У відкритому hint panel для `UI-CMP-012 Combo List Config Module` або actions menu показувати:

- navigation між controls;
- `confirm` для вибору або apply;
- `back` або `closePanel` для закриття module, actions menu або page-level dialog і повернення focus;
- clear/reset command тільки якщо він доступний.

### Створення custom combo

У відкритому hint panel для builder surfaces показувати:

- `builderSelectMove`;
- `builderUndoMove`;
- `builderFinish`, якщо combo можна завершити;
- `builderCancel`;
- `builderNextGroup` і `builderPreviousGroup`, якщо є move groups.

Якщо focus перебуває у `UI-CMP-035 Combo Whiteboard`, hint panel має показувати contextual whiteboard actions без додавання нових semantic commands:

- navigation між internal move candidates, steps і gaps;
- `builderSelectMove` для focused valid candidate;
- `builderNextGroup` і `builderPreviousGroup` для internal move groups, якщо вони є;
- `confirm` або `openActions` для local step/gap menu;
- pick up/drop reorder, якщо step можна переносити;
- confirm або cancel pending truncate, якщо replay повернув invalid tail;
- `back` для закриття menu, cancel pick up/drop або повернення focus до safe builder control.

Якщо focus перебуває у `UI-CMP-036 Combo Frame Meter`, hint panel має показувати contextual frame inspection actions без додавання нових semantic commands:

- navigation між timeline segments;
- `confirm` або `openActions` для відкриття readable segment details;
- `back` для закриття segment details і повернення focus на source segment;
- перехід focus між Frame Meter, Whiteboard і Action Bar відповідно до layout;
- invalid transition details, якщо replay повернув pending truncate або stale boundary.

## Доступність

- Indicator є button з accessible name.
- `label` є localized accessible name у closed state та visible connection status у opened state.
- `warning` color не є єдиним сигналом disconnect state: controller icon отримує dashed stroke.
- Decorative controller icon приховано від assistive technologies.
- `Enter` і `Space` відкривають або toggle hint panel.
- `Escape` закриває hint panel.
- Після закриття focus повертається на indicator.
- Hint panel не відкривається від hover-only interaction.
- Passive connect/disconnect updates не перехоплюють focus.
- Labels мають бути локалізовані відповідно до active language.

## Критерії приймання

- `UI-CMP-005` рендериться тільки всередині `UI-CMP-001 Global Top Bar`.
- Без controller і без active disconnect grace window компонент не відображається.
- Підключений controller показує icon-only trigger `28×28 px` із controller SVG `16×16 px` та `success` tone.
- Closed trigger не містить status dot, profile text або інших visible labels.
- Disconnect після active connection показує той самий controller icon із `warning` tone та dashed stroke протягом 1 хв.
- Після 1 хв без reconnect компонент переходить у `hiddenNoController`.
- Reconnect під час grace window одразу повертає `success` tone і normal stroke.
- Hint panel не відкривається автоматично при connect або disconnect.
- Hint panel відкривається через click, tap, `Enter` або `Space` на indicator.
- Open trigger не змінює геометрію та має selected/open treatment.
- Open panel показує profile header, visible connection status і ordered contextual hints у surface шириною не більше `20rem`.
- `Escape` закриває hint panel і повертає focus на indicator.
- Component не читає Browser Gamepad API напряму, не мапить physical input і не виконує controller commands.

## Тестові сценарії

- No controller state не показує `UI-CMP-005`.
- DualSense connected показує icon-only `success` trigger без profile text.
- Xbox connected показує icon-only `success` trigger без profile text.
- Unknown compatible controller показує fallback profile label тільки у відкритому panel header.
- Click на connected indicator відкриває hint panel.
- `Enter` на connected indicator відкриває hint panel.
- `Space` на connected indicator відкриває hint panel.
- `Escape` у відкритому hint panel закриває panel і повертає focus на indicator.
- Disconnect після connected state показує warning controller icon із dashed stroke.
- Yellow indicator лишається видимим протягом 1 хв після disconnect.
- Після 1 хв без reconnect indicator зникає.
- Reconnect до завершення 1 хв одразу повертає `success` tone і normal stroke.
- Hover на indicator не відкриває hint panel.
- Перехід із catalog до combo detail оновлює hints тільки в panel content, не відкриваючи panel автоматично.

## Відкриті уточнення

- Точний вигляд button labels для DualSense і Xbox буде визначено в `@mk-combos/controller-bridge`.
- Якщо буде додано controller help surface, `requestControllerHelp` має вказувати на його UI code.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.

## Flat Workspace Visual Contract

- Компонент входить в один page canvas і не створює card wrapper для звичайного content flow.
- Повна border, radius і shadow дозволені тільки owning overlay surface; peer content regions використовують spacing та один separator.
- Standalone icon-only actions використовують transparent `icon` presentation без background, visible border або inset shadow у всіх states; focus лишається зовнішнім ring.
- Text controls, `icon + text` actions, notation keycaps, validation і focus indicators зберігають необхідні interaction boundaries.
