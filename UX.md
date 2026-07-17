# UX сценарії

Цей документ є індексом користувацьких сценаріїв для `mk-combos`.

Архітектурний контекст описано в [ARCHITECTURE.md](./ARCHITECTURE.md): один web app shell, route-prefixed `gameId`, game-specific business entry points для `MKXL` і `MK1`, local state/backup keyed by `GameId`.

## UX принципи

- Користувач працює з обома іграми в одному застосунку.
- Route prefix визначає active game для deep links: `/mkxl/...` або `/mk1/...`.
- Settings зберігають default/last active game, але не перемагають valid route prefix.
- Settings відкривається як App Shell modal над current working route через
  `?settings=interface|backup`; Close, `Escape`, backdrop, browser Back і controller
  `Back` закривають modal, якщо nested/busy backup flow не має dismissal precedence.
- Game-specific правила не змішуються в UX: MKXL має variation/stage/interactable контекст, MK1 має main character/kameo контекст.
- Локальні lists і custom combos scoped by `gameId`.
- Кожен backup переносить рівно одну game slice; global settings та slices інших ігор не входять у файл.
- Settings показує по одному backup accordion item для кожної installed game, а slice валідить відповідний business entry point.
- Settings autosave-ить language і notation display mode одразу після вибору; persistence failure лишає value активним у session-only режимі.
- Підключений controller отримує єдину in-flow command ribbon в App Shell; input glyphs відповідають selected notation display mode, а не detected controller profile.

## Контексти входу

### Перший запуск

- [`US-001`](./ux/US-001.md): Перший запуск.
  Мета: дати користувачу пройти обов'язкове легке налаштування default language, default game і notation display mode перед root catalog entry; `uk`/`uk-*` browser locale дає default `UA`, решта locale — `EN`.
  Статус деталізації: Описано.

### Перший запуск за прямим посиланням

- `US-023`: Перший запуск за прямим посиланням.
  Мета: дати користувачу вперше відкрити route-prefixed URL, наприклад `/mkxl/catalog` або `/mk1/catalog/scorpion/cyrax/scorpion-cyrax-seed-001`, без ручного setup.
  Статус деталізації: Заплановано.

### Повернення за прямим посиланням

- `US-024`: Повернення за прямим посиланням.
  Мета: дати користувачу з наявними local settings, lists або custom combos повторно відкрити конкретний game-prefixed URL.
  Статус деталізації: Заплановано.

### Внутрішня навігація

Внутрішня навігація відбувається через shared App Shell. Перемикання гри змінює route prefix і active business entry point, але не видаляє local data іншої гри.

## Робочі сценарії

### Початкове налаштування

- `US-008`: Перемикання мови `EN/UA`.
  Мета: дати користувачу змінити й одразу autosave-нути мову інтерфейсу та локалізованого контенту.
  Статус деталізації: Заплановано.

- `US-009`: Перемикання відображення інпутів `FGC/PlayStation/Xbox`.
  Мета: показувати одне й те саме combo у зручному форматі та одразу autosave-нути selected display mode.
  Статус деталізації: Заплановано.

- `US-021`: Перегляд controller hints.
  Мета: показати актуальні contextual commands у єдиній App Shell ribbon з glyphs selected FGC/PlayStation/Xbox mode; Top Bar status/hint panel лишається окремою surface.
  Статус деталізації: Описано.

### Дослідження каталогу

- `US-002`: Вибір гри.
  Мета: дати користувачу перемикатися між installed games через route prefix і business entry point.
  Статус деталізації: Заплановано.

- `US-003`: Вибір персонажа.
  Мета: звузити каталог до персонажа active game.
  Статус деталізації: Заплановано.

- `US-004`: Вибір variation для `MKXL`.
  Мета: показати MKXL combos з урахуванням variation персонажа.
  Статус деталізації: Заплановано.

- `US-005`: Вибір kameo для `MK1`.
  Мета: показати MK1 combos з урахуванням kameo-пари.
  Статус деталізації: Заплановано.

- `US-006`: Фільтрація комбо.
  Мета: допомогти користувачу звузити combo list за metadata filters, які надає active game business.
  Статус деталізації: Заплановано.

- `US-007`: Перегляд деталей комбо.
  Мета: показати notation, move path, frame timeline, damage, meter, позицію, notes, source і game version.
  Статус деталізації: Заплановано.

### Персональна організація

- `US-010`: Створення named list.
  Мета: дати користувачу створити список у межах active `gameId`.
  Статус деталізації: Заплановано.

- `US-011`: Керування named lists.
  Мета: дати користувачу перейменовувати, видаляти та впорядковувати списки без змішування game slices.
  Статус деталізації: Заплановано.

- `US-012`: Додавання combo у список.
  Мета: зберегти seeded або custom combo у compatible list тієї самої гри.
  Статус деталізації: Заплановано.

### Створення власних комбо

- `US-013`: Створення custom combo через guided builder.
  Мета: дати користувачу скласти власне combo тільки з valid next moves, які повертає active game builder.
  Статус деталізації: Заплановано.

- `US-014`: Дублювання seeded combo у custom combo.
  Мета: дати користувачу взяти seeded combo за основу у межах тієї самої гри.
  Статус деталізації: Заплановано.

- `US-015`: Редагування custom combo.
  Мета: дати користувачу змінити власне combo через актуальний game-specific builder.
  Статус деталізації: Заплановано.

- [`US-025`](./ux/US-025.md): MKXL map interactions у combo builder.
  Мета: дати користувачу будувати або дублювати MKXL combo з урахуванням карти, zone/segment і environment interactables.
  Статус деталізації: Заплановано.

### Перенесення та відновлення даних

- `US-017`: Експорт per-game backup.
  Мета: дати користувачу експортувати `GameBackupEnvelope` для однієї installed game без global settings та slices інших ігор.
  Статус деталізації: Заплановано.

- `US-018`: Імпорт per-game backup з preview і replace.
  Мета: дати користувачу замінити лише selected game slice після envelope/version/target validation і game-business validation; mismatched або uninstalled `gameId` відхиляється.
  Статус деталізації: Заплановано.

### Керування контролером

- `US-019`: Керування застосунком через DualSense або Xbox controller.
  Мета: дати користувачу керувати First Launch, global menu, Catalog/filter drawer, Combo Detail, Settings modal/nested backup dialogs і Recovery через semantic controller commands.
  Статус деталізації: Описано.

- `US-020`: Керування combo builder через controller.
  Мета: дати користувачу створювати custom combo в builder через semantic controller commands. Поточна Builder route є placeholder і показує тільки global `Menu` command.
  Статус деталізації: Заплановано.

- `US-022`: Відновлення роботи після disconnect/reconnect controller.
  Мета: приховати ribbon і controller ring під час disconnect, зберегти logical focus і відновити актуальний context після neutral reconnect.
  Статус деталізації: Описано.

### Стан помилки та відновлення

- `US-016`: Обробка invalid/stale custom combo.
  Мета: показати користувачу, що локальне combo стало невалідним після оновлення game-owned move graph, без видалення даних.
  Статус деталізації: Заплановано.
