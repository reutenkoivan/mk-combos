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

`UI-CMP-005 Controller Hint Strip` є compact controller indicator у межах `UI-CMP-001 Global Top Bar`.

За замовчуванням компонент показує тільки indicator:

- якщо controller підключено: зелене коло і значок controller;
- якщо controller щойно від'єднано: жовте коло і значок відсутнього з'єднання протягом 1 хвилини;
- якщо controller не підключено і немає active disconnect grace window: компонент не відображається.

Contextual hints не показуються автоматично. Hint panel відкривається тільки після взаємодії з indicator: click, tap або keyboard activation `Enter`/`Space`.

## Володіння

`UI-CMP-005` завжди рендериться всередині `UI-CMP-001 Global Top Bar`.

`UI-CMP-001` контролює:

- позицію indicator у Top Bar;
- visible або hidden state;
- open або closed state hint panel;
- responsive wrapping;
- relationship із navigation actions Top Bar.

`UI-CMP-005` не позиціонується самостійно в shell layout і не є direct child `UI-PAGE-001 App Shell`.

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

- показано зелене коло;
- показано значок controller;
- indicator має accessible name, який називає active controller profile;
- hint panel лишається закритим, поки користувач не взаємодіє з indicator.

### `disconnectGraceIndicator`

Controller від'єднано після активного підключення, і з disconnect event минуло менше або рівно 1 хвилини.

Очікуваний UI:

- показано жовте коло;
- показано значок відсутнього з'єднання;
- indicator має readable або accessible text про втрату з'єднання;
- hint panel лишається закритим, поки користувач не взаємодіє з indicator.

Після завершення 1 хвилини компонент переходить у `hiddenNoController`, якщо controller не reconnect.

### `hintPanelClosed`

Indicator видимий, але hint panel закритий.

Очікуваний UI:

- visible state є `connectedIndicator` або `disconnectGraceIndicator`;
- повний список hints не показується;
- indicator доступний як button.

### `hintPanelOpen`

Користувач відкрив hint panel через indicator.

Очікуваний UI:

- hint panel показує contextual hints для active surface;
- panel прив'язаний до indicator у `UI-CMP-001 Global Top Bar`;
- `Escape` закриває panel;
- focus повертається на indicator після закриття.

## Правила відображення

### Базова видимість

- Немає controller і немає recent disconnect: не показувати компонент.
- Controller підключено: показати green connected indicator.
- Controller disconnected після active connection: показати yellow disconnect indicator протягом 1 хв.
- Controller reconnect під час 1-minute window: одразу замінити yellow indicator на green indicator.

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
- `addToList`, якщо combo можна додати в list;
- `removeFromList`, якщо item уже в list context;
- `openActions`, якщо є contextual actions menu;
- `back`, якщо detail або panel можна закрити.

### Фільтри й меню дій

У відкритому hint panel для filters panel або actions menu показувати:

- navigation між controls;
- `confirm` для вибору або apply;
- `back` або `closePanel`;
- clear/reset command тільки якщо він доступний.

### Створення custom combo

У відкритому hint panel для builder surfaces показувати:

- `builderSelectMove`;
- `builderUndoMove`;
- `builderFinish`, якщо combo можна завершити;
- `builderCancel`;
- `builderNextGroup` і `builderPreviousGroup`, якщо є move groups.

## Доступність

- Indicator є button з accessible name.
- Green/yellow color state не є єдиним сигналом стану.
- Значок controller і значок відсутнього з'єднання мають текстовий або accessible equivalent.
- `Enter` і `Space` відкривають або toggle hint panel.
- `Escape` закриває hint panel.
- Після закриття focus повертається на indicator.
- Hint panel не відкривається від hover-only interaction.
- Passive connect/disconnect updates не перехоплюють focus.
- Labels мають бути локалізовані відповідно до active language.

## Критерії приймання

- `UI-CMP-005` рендериться тільки всередині `UI-CMP-001 Global Top Bar`.
- Без controller і без active disconnect grace window компонент не відображається.
- Підключений controller показує green indicator із controller icon.
- Disconnect після active connection показує yellow indicator із no-connection icon протягом 1 хв.
- Після 1 хв без reconnect компонент переходить у `hiddenNoController`.
- Reconnect під час grace window одразу повертає green indicator.
- Hint panel не відкривається автоматично при connect або disconnect.
- Hint panel відкривається через click, tap, `Enter` або `Space` на indicator.
- `Escape` закриває hint panel і повертає focus на indicator.
- Component не читає Browser Gamepad API напряму, не мапить physical input і не виконує controller commands.

## Тестові сценарії

- No controller state не показує `UI-CMP-005`.
- DualSense connected показує green indicator із controller icon.
- Xbox connected показує green indicator із controller icon.
- Unknown compatible controller показує green indicator із fallback profile label.
- Click на connected indicator відкриває hint panel.
- `Enter` на connected indicator відкриває hint panel.
- `Space` на connected indicator відкриває hint panel.
- `Escape` у відкритому hint panel закриває panel і повертає focus на indicator.
- Disconnect після connected state показує yellow indicator із no-connection icon.
- Yellow indicator лишається видимим протягом 1 хв після disconnect.
- Після 1 хв без reconnect indicator зникає.
- Reconnect до завершення 1 хв одразу замінює yellow indicator на green indicator.
- Hover на indicator не відкриває hint panel.
- Перехід із catalog до combo detail оновлює hints тільки в panel content, не відкриваючи panel автоматично.

## Відкриті уточнення

- Точний вигляд controller icon і no-connection icon буде визначено під час UI реалізації.
- Точний вигляд button labels для DualSense і Xbox буде визначено в `@mk-combos/controller-bridge`.
- Якщо буде додано controller help surface, `requestControllerHelp` має вказувати на його UI code.
