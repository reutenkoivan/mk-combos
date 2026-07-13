# UI-CMP-038: Controller Access Gate

## Метадані

- Код: `UI-CMP-038`
- Назва: `Controller Access Gate`
- Тип: `component / shared system state block`
- Власник: `@mk-combos/ui`
- Батьківська сторінка: `UI-PAGE-001 App Shell`

## Призначення

`UI-CMP-038` блокує application content, доки controller-only session не готова. Компонент отримує prepared capability state з App Shell і не читає Browser Gamepad API.

Visible states: `checking`, `unsupported`, `blocked`, `awaitingGesture`, `awaitingNeutral`, `disconnected`. У `ready` і `suspended` компонент не монтує visible overlay.

## Анатомія

```jsx
<ControllerAccessGate ui="UI-CMP-038">
  <ControllerGateSurface role="dialog" modal>
    <ControllerIdentityRegion />
    <ControllerStateMessage />
    <Show when={hasProfileLabel}>
      <ControllerProfileLabel />
    </Show>
    <Show when={hasActivationHints}>
      <ControllerActivationHintList />
    </Show>
  </ControllerGateSurface>
</ControllerAccessGate>
```

## Контракт

Inputs:

- `state`: prepared controller capability/lifecycle state;
- `layoutMode`: `mobile`, `tablet` або `desktop`;
- localized `title`, `description`, `statusLabel`;
- optional `profileLabel`, activation hints і `resumeFocusTarget`.

Outputs відсутні. Capability polling, session ownership і focus restoration належать `@mk-combos/controller-bridge` та App Shell.

## Responsive і controller behavior

- `mobile`: edge-safe full-screen gate, one-column hints і targets не менші за `44×44px`;
- `tablet`: centered gate з two-column hint list;
- `desktop`: centered narrow workstation flow без card panel;
- first controller gesture тільки активує session; UI лишається в `awaitingNeutral` до повного release;
- disconnect не скидає route або domain state;
- після reconnect App Shell відновлює previous semantic focus або declared fallback;
- `unsupported` і `blocked` використовують blocking diagnostic state, а не silent fallback на інший input.

## Доступність і тести

- visible gate має `role="dialog"`, `aria-modal="true"`, accessible title і description;
- status changes оголошуються через polite або assertive live region;
- ready state не залишає hidden focus targets;
- Storybook покриває mobile activation, blocked, awaiting-neutral і disconnected states;
- component tests фіксують strict state contract і unmount у `ready`.

## Flat Workspace Visual Contract

- Компонент входить в один page canvas і не створює card wrapper для звичайного content flow.
- Повна border, radius і shadow дозволені тільки owning overlay surface; peer content regions використовують spacing та один separator.
- Standalone icon-only actions використовують transparent `icon` presentation без background, visible border або inset shadow у всіх states; focus лишається зовнішнім ring.
- Text controls, `icon + text` actions, notation keycaps, validation і focus indicators зберігають необхідні interaction boundaries.
