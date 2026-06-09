# UI-PAGE-001: App Shell

## Метадані

- Код: `UI-PAGE-001`
- Назва: `App Shell`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Пов'язані компоненти: `UI-CMP-001`, `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004`, `UI-CMP-005`
- Пов'язані UX сценарії: `US-001`, `US-008`, `US-009`, `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-PAGE-001 App Shell` є постійною рамкою застосунку. Вона тримає глобальний контекст, показує активну робочу сторінку, керує базовими налаштуваннями та передає команди контролера до поточної UI-поверхні.

App Shell має бути присутнім після старту застосунку в усіх режимах, але може блокувати доступ до робочих сторінок, якщо `UI-PAGE-002 First-Launch Setup` ще не завершено.

App Shell відповідає за:

- глобальну розмітку застосунку;
- показ активної сторінки або обов'язкового first-launch gate;
- перемикання `game`, `language` і `notation display mode`;
- збереження та застосування local browser settings;
- показ стану controller connection і contextual controller hints;
- маршрутизацію semantic controller commands до активної сторінки;
- показ спільних системних повідомлень, якщо вони не належать конкретній сторінці.

App Shell не відповідає за:

- фільтрацію combo list;
- рендер деталей конкретного combo;
- редагування custom combo path;
- import/export validation;
- пряме читання seeded combo graph;
- пряму зміну стану доменних компонентів.

## Зони розмітки

```text
UI-PAGE-001 App Shell
  ├─ UI-CMP-001 Global Top Bar
  │  ├─ UI-CMP-002 Game Switcher
  │  ├─ UI-CMP-003 Language Switcher
  │  └─ UI-CMP-004 Display Mode Switcher
  ├─ Слот активної сторінки
  ├─ Шар накладних панелей і діалогів
  ├─ Область системних повідомлень
  └─ UI-CMP-005 Controller Hint Strip
```

### Кореневий контейнер Shell

Кореневий контейнер Shell є зовнішнім контейнером застосунку. Він задає базову адаптивну сітку, фон, відступи, поведінку focus/skip navigation і місце для активної UI-поверхні.

Кореневий контейнер Shell має:

- займати весь viewport;
- не створювати зайвий контейнер прокручування без потреби;
- дозволяти активній сторінці керувати власним вертикальним прокручуванням;
- тримати стабільні зони для top bar і controller hints;
- не перекривати content controller hints або system messages.

### UI-CMP-001 Global Top Bar

`UI-CMP-001 Global Top Bar` є постійною верхньою панеллю. Вона показує назву застосунку або поточний context summary, глобальні перемикачі та entry points до основних surfaces.

Top Bar має:

- показувати активну game або давати змогу її змінити через `UI-CMP-002`;
- показувати активну language через `UI-CMP-003`;
- показувати active notation mode через `UI-CMP-004`;
- давати доступ до catalog, lists, builder і backup actions;
- лишатися keyboard reachable;
- не дублювати локальні controls активної сторінки.

### Слот активної сторінки

Слот активної сторінки є областю, де App Shell показує поточну сторінку:

- `UI-PAGE-002 First-Launch Setup`;
- `UI-PAGE-003 Catalog`;
- `UI-PAGE-004 Combo Detail`;
- `UI-PAGE-005 Named Lists`;
- `UI-PAGE-006 Custom Combo Builder`;
- `UI-PAGE-007 Backup Management`.

Слот отримує глобальний контекст від App Shell і не має самостійно читати глобальні browser settings.

### Шар накладних панелей і діалогів

Шар накладних панелей і діалогів використовується для елементів, які відкриваються поверх активної сторінки.

У першому релізі в цьому шарі можуть з'являтися:

- `UI-CMP-012 Filters Panel`;
- `UI-CMP-018 Combo Actions Menu`;
- `UI-CMP-021 Add-To-List Dialog`;
- `UI-CMP-022 List Edit Dialog`;
- `UI-CMP-027 Export Dialog`;
- `UI-CMP-028 Import Preview Dialog`.

App Shell має забезпечити, що накладний елемент:

- має керований фокус;
- закривається через `back`, якщо це дозволено поточним flow;
- не губить стан активної сторінки після закриття;
- не блокує first-launch gate правила.

### Область системних повідомлень

Область системних повідомлень показує повідомлення, які стосуються всього застосунку, а не конкретної сторінки.

Приклади:

- localStorage недоступний, app працює в session-only режимі;
- controller disconnected або reconnected;
- settings не вдалося зберегти;
- deep link частково відновлено, але частину context довелося скинути.

Системні повідомлення мають бути неблокувальними, якщо стан не є критичним.

### UI-CMP-005 Controller Hint Strip

`UI-CMP-005 Controller Hint Strip` показує contextual hints для активного controller profile.

Strip має:

- показувати labels для DualSense, Xbox або Standard Gamepad fallback;
- оновлювати hints при зміні active surface;
- зникати або згортатися, якщо controller не підключено;
- не замінювати keyboard/mouse controls;
- не перекривати основний content.

## Контракти компонентів

### UI-CMP-001 Global Top Bar

Вхідні дані:

- active route або active surface code;
- active game;
- active language;
- active notation display mode;
- availability основних actions;
- optional summary стану controller connection.

Вихідні події:

- запит змінити game;
- запит змінити language;
- запит змінити notation display mode;
- запит перейти до catalog, lists, builder або backup management;
- запит відкрити actions menu, якщо він доступний.

Межі відповідальності:

- не зберігає settings напряму;
- не читає seeded combo data;
- не вирішує, які combo показувати;
- не виконує import/export.

### UI-CMP-002 Game Switcher

Вхідні дані:

- active game: `MKXL` або `MK1`;
- список доступних games;
- disabled state, якщо game switch тимчасово недоступний;
- optional reason для disabled state.

Вихідні події:

- запит змінити active game.

Межі відповідальності:

- не обирає character, variation або kameo автоматично без рішення App Shell;
- не фільтрує combo list самостійно.

### UI-CMP-003 Language Switcher

Вхідні дані:

- active language: `EN` або `UA`;
- список підтримуваних мов;
- disabled state, якщо settings зараз зберігаються.

Вихідні події:

- запит змінити active language.

Межі відповідальності:

- не зберігає language у localStorage;
- не вирішує fallback для unsupported browser locale.

### UI-CMP-004 Display Mode Switcher

Вхідні дані:

- active notation display mode: `FGC`, `PlayStation` або `Xbox`;
- список підтримуваних display modes;
- disabled state, якщо mode change тимчасово недоступний.

Вихідні події:

- запит змінити notation display mode.

Межі відповідальності:

- не перераховує notation самостійно;
- не змінює source of truth combo data;
- не пише `cachedNotation`.

### UI-CMP-005 Controller Hint Strip

Вхідні дані:

- controller connection state;
- active controller profile;
- hints для активної сторінки;
- active surface code;
- налаштування collapsed або visible, якщо таке буде додане.

Вихідні події:

- запит згорнути або розгорнути hints;
- optional запит відкрити controller help, якщо така UI-поверхня буде додана.

Межі відповідальності:

- не читає Browser Gamepad API напряму;
- не нормалізує buttons або axes;
- не виконує controller commands;
- не змінює маршрутизацію застосунку.

## Мапа станів

### `ready`

App Shell має валідні settings, active surface визначено, global controls доступні.

Очікуваний інтерфейс:

- `UI-CMP-001 Global Top Bar` видимий;
- слот активної сторінки показує поточну сторінку;
- `UI-CMP-005 Controller Hint Strip` показаний тільки за наявності controller або hints preference;
- system messages приховані, якщо немає активних повідомлень.

### `firstLaunchBlocked`

У браузері немає completed first-launch marker або обов'язкових settings.

Очікуваний інтерфейс:

- слот активної сторінки показує `UI-PAGE-002 First-Launch Setup`;
- робочі сторінки недоступні для переходу;
- Top Bar може показувати обмежений набір controls;
- skip або close action для first-launch gate не доступні.

### `deepLinkResolved`

Користувач відкрив URL, який вказує на конкретну сторінку або context, і App Shell успішно відновив цей context.

Очікуваний інтерфейс:

- active surface відповідає deep link;
- global settings застосовані до active surface;
- якщо частина context неповна, active surface показує найближчий валідний selection state.

### `settingsUnavailable`

Local persistence недоступна або save operation не може бути завершена.

Очікуваний інтерфейс:

- App Shell показує session-only або recoverable warning;
- користувач може продовжити роботу в межах поточної сесії;
- actions, які потребують persistence, мають пояснювати обмеження.

### `controllerConnected`

Controller підключено, profile визначено або застосовано Standard Gamepad fallback.

Очікуваний інтерфейс:

- `UI-CMP-005 Controller Hint Strip` показує contextual hints;
- active surface отримує semantic commands через App Shell;
- keyboard і mouse controls лишаються доступними.

### `controllerDisconnected`

Controller відключено або більше не дає stable input.

Очікуваний інтерфейс:

- controller hints приховані, згорнуті або показують passive disconnected state;
- active surface не скидається;
- keyboard і mouse flow не змінюються.

## Навігація і потік даних

### Блокування першим запуском

1. App Shell завантажує local settings або session settings.
2. Якщо required settings відсутні, shell переходить у `firstLaunchBlocked`.
3. Слот активної сторінки показує `UI-PAGE-002 First-Launch Setup`.
4. Після підтвердження setup App Shell застосовує settings.
5. Користувач переходить до `UI-PAGE-003 Catalog`.

### Відновлення deep link

1. App Shell отримує route або URL context.
2. Shell перевіряє, чи first-launch gate дозволяє відкрити target surface.
3. Shell відновлює game, character, combo id або builder context, якщо вони є в URL.
4. Якщо context валідний, shell відкриває target surface.
5. Якщо context неповний або stale, shell відкриває найближчий recoverable state і показує system message.

### Перемикання активної UI-поверхні

App Shell може перемикати active surface через:

- global navigation action;
- controller command;
- deep link;
- completion action іншої сторінки;
- fallback після recoverable error.

При перемиканні active surface App Shell має:

- зберегти global settings;
- закрити несумісні overlays;
- оновити controller hints;
- не скидати local user data;
- не виконувати domain action без явного user command.

### Передача глобальних налаштувань

Global settings застосовуються зверху вниз:

```text
App Shell settings
  -> Слот активної сторінки
  -> Page-level components
  -> Display-only components
```

Settings не мають змінювати source of truth seeded або custom combo data. Наприклад, notation display mode впливає на rendering, але не змінює `movePath` або `cachedNotation`.

### Передача команд контролера

1. `@mk-combos/controller-bridge` емітить semantic command.
2. App Shell визначає active surface.
3. App Shell перевіряє, чи overlay зараз перехоплює команду.
4. Команда передається overlay або active surface.
5. Якщо команда не підтримується в поточному context, вона ігнорується без зміни стану.

## Доступність і поведінка вводу

- Усі global controls мають бути доступні з keyboard.
- Focus order починається з App Shell controls і переходить до active surface.
- `focus-visible` має бути помітним на top bar controls, dialogs, panels і controller hint actions.
- `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004` мають visible label або accessible name.
- Controller hints не є єдиним способом зрозуміти доступні actions.
- Disconnect controller не має забирати focus із keyboard/mouse flow.
- Overlay має повертати focus до trigger або безпечного shell control після закриття.
- Non-blocking system messages не мають перехоплювати focus.
- Fatal error state має мати зрозумілий action для reload або повернення до safe surface.

## Критерії приймання

- App Shell показує активну робочу сторінку після завершення first-launch setup.
- Без завершеного first-launch setup App Shell не дозволяє перейти до catalog, detail, lists або builder.
- Game, language і notation display mode змінюються через global controls і застосовуються до активної сторінки.
- Session-only persistence state показує попередження, але не блокує основний flow.
- Deep link відкриває відповідний surface або recoverable fallback state.
- Controller connection оновлює `UI-CMP-005 Controller Hint Strip`.
- Controller disconnect/reconnect не скидає active surface і не ламає keyboard/mouse flow.
- App Shell не виконує domain-specific mutation напряму: builder, filters, lists і backup logic лишаються у відповідних surfaces.

## Тестові сценарії

- Fresh browser state відкриває root URL і бачить `UI-PAGE-002 First-Launch Setup` у Shell Outlet.
- Після підтвердження first-launch setup App Shell відкриває `UI-PAGE-003 Catalog`.
- Зміна language у `UI-CMP-003` одразу оновлює shell labels і передає language активній сторінці.
- Зміна notation display mode у `UI-CMP-004` не змінює `movePath` або seeded data.
- Deep link на combo detail відкриває `UI-PAGE-004 Combo Detail`, якщо context валідний.
- Deep link з неповним context відкриває recoverable selection state і показує system message.
- Відкритий overlay перехоплює `back`, якщо overlay може бути закритий.
- Controller connect показує hints для активного surface.
- Controller disconnect приховує або згортає hints без скидання active surface.
- Keyboard focus лишається видимим під час переходу між top bar, активною UI-поверхнею і накладним елементом.

## Відкриті уточнення

- Точний набір route paths для активних UI-поверхонь буде визначено під час реалізації `apps/web`.
- Візуальна щільність Top Bar і позиція Controller Hint Strip мають бути перевірені на desktop і mobile layouts.
- Custom controller button remapping не входить у перший реліз, якщо це не буде додано окремим UX сценарієм.
