# UI-PAGE-002: First-Launch Setup

## Метадані

- Код: `UI-PAGE-002`
- Назва: `First-Launch Setup`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Пов'язані компоненти: `UI-CMP-006`, `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004`, `UI-CMP-030`
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані UX сценарії: `US-001`, `US-002`, `US-008`, `US-009`, `US-021`, `US-023`

## Призначення

`UI-PAGE-002 First-Launch Setup` є обов'язковим стартовим gate для root first launch у браузері, де немає local settings або first-launch completion marker.

Сторінка має:

- коротко пояснити можливості застосунку;
- дати вибрати початкові settings: default `game`, `language` і `notation display mode`;
- вимагати явне підтвердження перед доступом до робочих surfaces у root first launch;
- передати підтверджені settings в app-level state;
- перевести користувача до `/:gameId/catalog` після завершення setup.

`UI-PAGE-002` встановлює тільки початкові значення. Після завершення first launch ручна зміна `game`, `language` і `notation display mode` відбувається через `UI-PAGE-008 Settings`.

Valid route-prefixed deep link не рендерить `UI-PAGE-002`. Якщо URL містить installed `gameId`, App Shell застосовує URL-derived active game, default `notation display mode = FGC`, створює first-launch completion marker і одразу відкриває target surface без confirmation.

## Архітектурний контекст

Game options у setup беруться з `apps/web/src/game-business/installed-games.ts`. Setup не хардкодить MKXL/MK1 як єдині можливі ігри, а рендерить installed games.

## Зони розмітки

```text
UI-PAGE-002 First-Launch Setup
  ├─ Setup root
  ├─ Capabilities summary
  ├─ UI-CMP-006 First-Launch Setup Form
  │  ├─ UI-CMP-002 Game Switcher
  │  ├─ UI-CMP-003 Language Switcher
  │  ├─ UI-CMP-004 Display Mode Switcher
  │  └─ Confirmation action
  └─ Session-only / system message area
```

### Setup root

Setup root є єдиною активною surface, доки first-launch gate не завершено.

Root має:

- бути рендереним у slot активної сторінки `UI-PAGE-001 App Shell`;
- блокувати робочі surfaces до підтвердження;
- не показувати альтернативний шлях обходу gate;
- тримати форму й короткий опис можливостей у зрозумілому reading order;
- не перетворювати setup на landing page або onboarding wizard.

### Capabilities summary

Capabilities summary є коротким текстовим блоком перед або поруч із формою setup.

Summary має стисло назвати, що застосунок дає:

- `catalog` комбо для `MKXL` і `MK1`;
- filters для звуження списку маршрутів;
- `combo detail` з notation, metadata і move path;
- `named lists` для організації комбо;
- `custom combo builder` для створення власних маршрутів;
- `controller hints` для роботи з DualSense, Xbox або Standard Gamepad fallback;
- `import/export` для перенесення локальних даних.

Summary не має містити довгі інструкції, hero-блок або marketing copy. Його задача - швидко пояснити цінність app перед вибором початкових settings.

### UI-CMP-006 First-Launch Setup Form

`UI-CMP-006 First-Launch Setup Form` групує всі controls, потрібні для першого запуску.

Форма містить:

- `UI-CMP-002 Game Switcher`;
- `UI-CMP-003 Language Switcher`;
- `UI-CMP-004 Display Mode Switcher`;
- confirmation action.

Форма має підтримувати preselected defaults, але completion marker створюється тільки після явного підтвердження.

### Initial settings selectors

`UI-CMP-002`, `UI-CMP-003` і `UI-CMP-004` у `UI-PAGE-002` працюють як initial setup controls.

Доступні значення:

- game: installed game id, наприклад `MKXL` або `MK1`;
- language: `EN` або `UA`;
- notation display mode: `FGC`, `PlayStation` або `Xbox`.

Ці selectors не є постійними shell controls. Після завершення setup повторна ручна зміна цих settings належить `UI-PAGE-008 Settings`.

### Confirmation action

Confirmation action завершує first-launch gate.

Action стає доступним, коли:

- game має значення;
- language має значення;
- notation display mode має значення;
- app готовий застосувати settings хоча б у session-only режимі.

### Session-only / system message area

Session-only / system message area показує неблокувальні або recoverable повідомлення, які стосуються persistence.

Приклади:

- localStorage недоступний, settings діють тільки до завершення сесії;
- settings застосовані, але completion marker не вдалося зберегти;
- deep link буде відкрито після завершення setup.

`UI-CMP-030 Error State` використовується тільки для recoverable error або пояснення persistence limitation.

## Контракти компонентів

### UI-CMP-006 First-Launch Setup Form

Вхідні дані:

- preselected game;
- preselected language;
- preselected notation display mode;
- availability seeded combo data;
- persistence availability;
- saving state;
- validation state required choices.

Вихідні події:

- змінити initial game value;
- змінити initial language value;
- змінити initial notation display mode value;
- підтвердити setup;
- acknowledgement session-only warning, якщо потрібний non-blocking user acknowledgement.

Межі відповідальності:

- не створює completion marker напряму;
- не виконує route redirect напряму;
- не читає seeded combo data напряму;
- не показує робочі catalog/list/detail controls;
- не виконує import/export.

### UI-CMP-002 Game Switcher

Вхідні дані:

- selected game: installed game id;
- available games;
- disabled state, якщо game selection тимчасово недоступний.

Вихідні події:

- змінити initial game value.

Межі відповідальності:

- не відкриває `UI-PAGE-003 Catalog` самостійно;
- не обирає character, variation або kameo;
- не змінює game після завершення first launch.

### UI-CMP-003 Language Switcher

Вхідні дані:

- selected language: `EN` або `UA`;
- available languages;
- disabled state, якщо settings зараз зберігаються.

Вихідні події:

- змінити initial language value.

Межі відповідальності:

- не вирішує browser locale fallback;
- не зберігає language у localStorage напряму.

### UI-CMP-004 Display Mode Switcher

Вхідні дані:

- selected notation display mode: `FGC`, `PlayStation` або `Xbox`;
- available display modes;
- disabled state, якщо mode selection тимчасово недоступний.

Вихідні події:

- змінити initial notation display mode value.

Межі відповідальності:

- не перераховує notation самостійно;
- не змінює source of truth combo data;
- не пише `cachedNotation`.

## Мапа станів

### `initial`

App визначив first launch і показав setup з preselected defaults.

Очікуваний UI:

- capabilities summary видимий;
- form controls мають initial values;
- confirmation action доступний тільки після готовності required choices;
- робочі surfaces недоступні.

### `editing`

Користувач змінює game, language або notation display mode.

Очікуваний UI:

- form показує поточні unsaved choices;
- capabilities summary лишається коротким і не змінює layout;
- confirmation action відображає, чи всі required choices готові.

### `confirmable`

Усі required choices мають валідні значення.

Очікуваний UI:

- confirmation action доступний;
- session-only warning може бути видимий, якщо persistence недоступна;
- user може підтвердити preselected defaults без додаткового редагування.

### `saving`

App застосовує selected settings і намагається зберегти їх у local browser settings.

Очікуваний UI:

- form controls можуть бути disabled;
- confirmation action показує busy state;
- повторне підтвердження недоступне, поки save operation активна.

### `sessionOnly`

Local persistence недоступна, але app може застосувати settings у поточній сесії.

Очікуваний UI:

- показано коротке повідомлення про session-only режим;
- confirmation лишається можливою;
- користувач розуміє, що після reload setup може з'явитися знову.

### `saveError`

Settings не вдалося зберегти або completion marker не вдалося записати.

Очікуваний UI:

- `UI-CMP-030 Error State` або system message пояснює recoverable проблему;
- form не втрачає вибрані values;
- користувач може повторити confirmation або продовжити session-only, якщо app це дозволяє.

### `complete`

Setup підтверджено, settings застосовані, completion marker створено або session-only state активний.

Очікуваний UI:

- first-launch gate завершується;
- app переходить до `UI-PAGE-003 Catalog`;
- app не показує setup повторно в поточній сесії.

## Навігація і потік даних

### Root first launch

1. App-level settings state перевіряє local settings і first-launch completion marker.
2. Якщо required settings або marker відсутні, `UI-PAGE-001 App Shell` показує `UI-PAGE-002 First-Launch Setup`.
3. `UI-PAGE-002` показує capabilities summary і form.
4. Користувач підтверджує selected settings.
5. App-level state застосовує settings і створює completion marker.
6. App відкриває `/:gameId/catalog` для selected default game.

### Deep link bypass

1. App отримує target route з URL.
2. App Shell визначає, що URL є valid route-prefixed deep link.
3. App Shell не рендерить `UI-PAGE-002`.
4. App Shell бере `gameId` із route prefix і застосовує default `notation display mode = FGC`.
5. App Shell створює first-launch completion marker або session-only equivalent.
6. App Shell одразу відкриває target surface.
7. Якщо target context неповний або stale, App Shell відкриває recoverable fallback або `notFound` state без показу `UI-PAGE-002`.

### Передача settings

```text
UI-CMP-006 First-Launch Setup Form
  -> selected initial settings
  -> App-level settings state
  -> first-launch completion marker
  -> UI-PAGE-001 App Shell
  -> Active page
```

`UI-PAGE-002` не є source of truth після completion. Він збирає initial values і передає confirmation event у app-level state.

## Доступність і поведінка вводу

- Capabilities summary має бути readable text і не має бути єдиним місцем для важливої form instruction.
- Усі form controls мають visible label або accessible name.
- Keyboard order іде від capabilities summary до form controls і confirmation action.
- `focus-visible` має бути помітним на selectors, confirmation action і message actions.
- Gate не має альтернативної UI-дії для обходу setup.
- Controller hints можуть бути показані через `UI-CMP-005`, але не є обов'язковими для проходження setup.
- Session-only або persistence warnings мають бути зрозумілі без кольору як єдиного сигналу.
- Busy state під час `saving` має бути оголошений assistive technologies.

## Критерії приймання

- First-launch setup показується для root first launch, якщо немає local settings або completion marker.
- Valid deep link не показує `UI-PAGE-002`, навіть якщо local settings або completion marker ще відсутні.
- Capabilities summary коротко згадує `catalog`, filters, `combo detail`, `named lists`, `custom combo builder`, `controller hints` і `import/export`.
- Capabilities summary не перетворює setup на onboarding wizard або landing page.
- У root first launch доступ до робочих surfaces відкривається тільки після explicit confirmation.
- Preselected defaults можна підтвердити одним action, але вони не завершують first launch без confirmation.
- Selected game, language і notation display mode застосовуються одразу після confirmation.
- Після completion root first launch переходить до `/:gameId/catalog`.
- Deep-link first launch застосовує URL-derived `gameId`, `FGC` і completion marker без confirmation.
- Після first launch ручна зміна settings відбувається через `UI-PAGE-008 Settings`.
- `UI-PAGE-002` не рендерить робочі catalog, list, builder або backup controls.

## Тестові сценарії

- Fresh browser state відкриває root URL і бачить `UI-PAGE-002 First-Launch Setup`.
- Capabilities summary коротко описує основні можливості app і не займає роль повного onboarding.
- Preselected defaults показані в game, language і display mode controls.
- Вибір `UA`, `MK1`, `Xbox` і confirmation відкриває `/mk1/catalog`.
- Без confirmation користувач не може перейти до catalog, combo detail, named lists або builder.
- localStorage unavailable показує session-only warning і дозволяє session-only confirmation.
- Save error не стирає selected values і показує recoverable error.
- Після confirmation root flow відкриває `/:gameId/catalog`.
- Valid deep link у fresh browser state не показує setup і одразу відкриває target surface.
- Valid deep link застосовує URL-derived `gameId` і `FGC` без confirmation.
- Після valid deep link auto-config наступний root launch не показує setup, якщо completion marker збережено.
- Controller connected не блокує setup і не забирає focus із form controls.

## Відкриті уточнення

- Точний текст capabilities summary буде визначено під час UI copy pass.
- Точний browser locale fallback для default language належить app-level settings logic.
- Точний вигляд persistence warning буде узгоджено з shared system message styles.
