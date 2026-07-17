import type { ReactNode } from "react";

import { Present, type PresentContentProps } from "../primitives/conditional";
import { cx } from "../recipes/class-name";
import { indicatorRecipe } from "../recipes/indicator";
import type { UiNotationIconDescriptor } from "./type";

export type NotationIconProps = {
  commandAccent?: boolean;
  descriptor: UiNotationIconDescriptor;
  tone?: "accent" | "neutral";
};

type PlatformGlyph = {
  platform: "fgc" | "playstation" | "xbox";
  glyph: string;
  symbol?: PlatformGlyphSymbol;
};

type PlatformGlyphSymbol =
  | {
      direction: Direction;
      kind: "dpad";
    }
  | {
      direction: Direction;
      kind: "stick";
      side: "left" | "right";
    }
  | {
      kind: "badge";
    };

type Direction = "down" | "left" | "right" | "up";

type Platform = PlatformGlyph["platform"];

type DpadSegment = {
  direction: Direction;
  height: number;
  id: string;
  width: number;
  x: number;
  y: number;
};

type SvgGlyphProps = {
  name: string;
};

const playStationGlyphColors: Record<string, string> = {
  circle: "#ff3b46",
  cross: "#2f8df7",
  square: "#ff7ab6",
  triangle: "#00d084",
};

const xboxGlyphColors: Record<string, string> = {
  A: "#79d14b",
  B: "#ff4a4a",
  X: "#1ba9f5",
  Y: "#f3df31",
};

const directionGlyphs: Record<string, string> = {
  "notation-back": "\u2190",
  "notation-down": "\u2193",
  "notation-forward": "\u2192",
  "notation-up": "\u2191",
};

const displayModeGlyphs: Record<string, string> = {
  "notation-display-fgc": "FGC",
  "notation-display-playstation": "PS",
  "notation-display-xbox": "XB",
};

const directionLabels: Record<Direction, string> = {
  down: "Down",
  left: "Left",
  right: "Right",
  up: "Up",
};

const dpadSegments = [
  { direction: "up", height: 26, id: "up", width: 24, x: 38, y: 10 },
  { direction: "down", height: 26, id: "down", width: 24, x: 38, y: 64 },
  { direction: "left", height: 24, id: "left", width: 26, x: 10, y: 38 },
  { direction: "right", height: 24, id: "right", width: 26, x: 64, y: 38 },
  { direction: "up", height: 24, id: "center", width: 24, x: 38, y: 38 },
] as const satisfies readonly DpadSegment[];

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  down: { x: 0, y: 24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  up: { x: 0, y: -24 },
};

const createBadgeGlyph = (platform: Platform, glyph: string): PlatformGlyph => ({
  glyph,
  platform,
  symbol: { kind: "badge" },
});

const createDpadGlyph = (platform: Platform, direction: Direction): PlatformGlyph => ({
  glyph: `D-${directionLabels[direction]}`,
  platform,
  symbol: { direction, kind: "dpad" },
});

const createStickGlyph = (
  platform: Platform,
  side: "left" | "right",
  direction: Direction,
): PlatformGlyph => ({
  glyph: `${side === "left" ? "L" : "R"}-${directionLabels[direction]}`,
  platform,
  symbol: { direction, kind: "stick", side },
});

const fgcGlyphs: Record<string, PlatformGlyph> = {
  "notation-fgc-1": { glyph: "1", platform: "fgc" },
  "notation-fgc-2": { glyph: "2", platform: "fgc" },
  "notation-fgc-3": { glyph: "3", platform: "fgc" },
  "notation-fgc-4": { glyph: "4", platform: "fgc" },
};

const playStationGlyphs: Record<string, PlatformGlyph> = {
  "notation-playstation-circle": { glyph: "circle", platform: "playstation" },
  "notation-playstation-cross": { glyph: "cross", platform: "playstation" },
  "notation-playstation-square": { glyph: "square", platform: "playstation" },
  "notation-playstation-triangle": { glyph: "triangle", platform: "playstation" },
  "notation-playstation-create": createBadgeGlyph("playstation", "Create"),
  "notation-playstation-dpad-down": createDpadGlyph("playstation", "down"),
  "notation-playstation-dpad-left": createDpadGlyph("playstation", "left"),
  "notation-playstation-dpad-right": createDpadGlyph("playstation", "right"),
  "notation-playstation-dpad-up": createDpadGlyph("playstation", "up"),
  "notation-playstation-l1": createBadgeGlyph("playstation", "L1"),
  "notation-playstation-l2": createBadgeGlyph("playstation", "L2"),
  "notation-playstation-l3": createBadgeGlyph("playstation", "L3"),
  "notation-playstation-left-stick-down": createStickGlyph("playstation", "left", "down"),
  "notation-playstation-left-stick-left": createStickGlyph("playstation", "left", "left"),
  "notation-playstation-left-stick-right": createStickGlyph("playstation", "left", "right"),
  "notation-playstation-left-stick-up": createStickGlyph("playstation", "left", "up"),
  "notation-playstation-options": createBadgeGlyph("playstation", "Options"),
  "notation-playstation-ps": createBadgeGlyph("playstation", "PS"),
  "notation-playstation-r1": createBadgeGlyph("playstation", "R1"),
  "notation-playstation-r2": createBadgeGlyph("playstation", "R2"),
  "notation-playstation-r3": createBadgeGlyph("playstation", "R3"),
  "notation-playstation-right-stick-down": createStickGlyph("playstation", "right", "down"),
  "notation-playstation-right-stick-left": createStickGlyph("playstation", "right", "left"),
  "notation-playstation-right-stick-right": createStickGlyph("playstation", "right", "right"),
  "notation-playstation-right-stick-up": createStickGlyph("playstation", "right", "up"),
};

const xboxGlyphs: Record<string, PlatformGlyph> = {
  "notation-xbox-a": { glyph: "A", platform: "xbox" },
  "notation-xbox-b": { glyph: "B", platform: "xbox" },
  "notation-xbox-x": { glyph: "X", platform: "xbox" },
  "notation-xbox-y": { glyph: "Y", platform: "xbox" },
  "notation-xbox-dpad-down": createDpadGlyph("xbox", "down"),
  "notation-xbox-dpad-left": createDpadGlyph("xbox", "left"),
  "notation-xbox-dpad-right": createDpadGlyph("xbox", "right"),
  "notation-xbox-dpad-up": createDpadGlyph("xbox", "up"),
  "notation-xbox-guide": createBadgeGlyph("xbox", "Guide"),
  "notation-xbox-lb": createBadgeGlyph("xbox", "LB"),
  "notation-xbox-left-stick-down": createStickGlyph("xbox", "left", "down"),
  "notation-xbox-left-stick-left": createStickGlyph("xbox", "left", "left"),
  "notation-xbox-left-stick-right": createStickGlyph("xbox", "left", "right"),
  "notation-xbox-left-stick-up": createStickGlyph("xbox", "left", "up"),
  "notation-xbox-ls": createBadgeGlyph("xbox", "LS"),
  "notation-xbox-lt": createBadgeGlyph("xbox", "LT"),
  "notation-xbox-menu": createBadgeGlyph("xbox", "Menu"),
  "notation-xbox-rb": createBadgeGlyph("xbox", "RB"),
  "notation-xbox-right-stick-down": createStickGlyph("xbox", "right", "down"),
  "notation-xbox-right-stick-left": createStickGlyph("xbox", "right", "left"),
  "notation-xbox-right-stick-right": createStickGlyph("xbox", "right", "right"),
  "notation-xbox-right-stick-up": createStickGlyph("xbox", "right", "up"),
  "notation-xbox-rs": createBadgeGlyph("xbox", "RS"),
  "notation-xbox-rt": createBadgeGlyph("xbox", "RT"),
  "notation-xbox-view": createBadgeGlyph("xbox", "View"),
};

const compactTokenLabels: Record<string, string> = {
  "notation-amplify": "AMP",
  "notation-block": "BLK",
  "notation-interactable": "INT",
  "notation-kameo": "K",
  "notation-stance-switch": "SS",
  "notation-unknown": "?",
};

const platformGlyphs: Record<string, PlatformGlyph> = {
  ...fgcGlyphs,
  ...playStationGlyphs,
  ...xboxGlyphs,
};

const SvgFrame = (props: SvgGlyphProps & { children: ReactNode }) => (
  <svg
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 100 100"
    data-ui-notation-svg={props.name}
    className="h-4 w-4 overflow-visible"
  >
    {props.children}
  </svg>
);

const createRegistrySvgName = (iconName: string) => {
  if (iconName.startsWith("notation-")) {
    return iconName.slice("notation-".length);
  }

  return iconName;
};

const renderPlayStationGlyph = (platformGlyph: PlatformGlyph, iconName: string) => {
  const { glyph } = platformGlyph;
  const color = playStationGlyphColors[glyph] ?? "#ff3b46";

  if (glyph === "square") {
    return (
      <SvgFrame name="playstation-square">
        <rect
          rx="2.5"
          x="22.5"
          y="22.5"
          width="55"
          fill="none"
          height="55"
          stroke={color}
          strokeWidth="8"
          data-ui-notation-svg-color={color}
        />
      </SvgFrame>
    );
  }

  if (glyph === "triangle") {
    return (
      <SvgFrame name="playstation-triangle">
        <path
          fill="none"
          stroke={color}
          strokeWidth="8"
          d="M50 18 82 76H18Z"
          strokeLinejoin="round"
          data-ui-notation-svg-color={color}
        />
      </SvgFrame>
    );
  }

  if (glyph === "cross") {
    return (
      <SvgFrame name="playstation-cross">
        <path
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          d="M27 27 73 73M73 27 27 73"
          data-ui-notation-svg-color={color}
        />
      </SvgFrame>
    );
  }

  if (glyph === "circle") {
    return (
      <SvgFrame name="playstation-circle">
        <circle
          r="31"
          cx="50"
          cy="50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          data-ui-notation-svg-color={color}
        />
      </SvgFrame>
    );
  }

  return renderControllerSymbol(platformGlyph, iconName);
};

const renderXboxLetter = (glyph: string, color: string) => {
  if (glyph === "A") {
    return (
      <path
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M26 76 50 24 74 76M36 59H64"
      />
    );
  }

  if (glyph === "B") {
    return (
      <path
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32 24V76M32 27H53C64 27 71 33 71 42C71 50 64 55 53 55H32M32 55H56C67 55 74 60 74 68C74 75 67 80 55 80H32"
      />
    );
  }

  if (glyph === "Y") {
    return (
      <path
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25 25 50 52M75 25 50 52M50 52V77"
      />
    );
  }

  return (
    <path
      fill="none"
      stroke={color}
      strokeWidth="11"
      strokeLinecap="round"
      d="M27 27 73 73M73 27 27 73"
    />
  );
};

const renderXboxGlyph = (platformGlyph: PlatformGlyph, iconName: string) => {
  const { glyph } = platformGlyph;
  const color = xboxGlyphColors[glyph];
  const lowerGlyph = glyph.toLowerCase();

  if (!color) {
    return renderControllerSymbol(platformGlyph, iconName);
  }

  return (
    <SvgFrame name={`xbox-${lowerGlyph}`}>
      <g data-ui-notation-svg-color={color}>{renderXboxLetter(glyph, color)}</g>
    </SvgFrame>
  );
};

const renderDpadGlyph = (name: string, direction: Direction) => (
  <SvgFrame name={name}>
    {dpadSegments.map((segment) => {
      const isCenter = segment.id === "center";
      const isActive = !isCenter && segment.direction === direction;

      return (
        <rect
          rx="5"
          x={segment.x}
          y={segment.y}
          key={segment.id}
          stroke="currentColor"
          width={segment.width}
          height={segment.height}
          strokeWidth={isActive ? 9 : 7}
          opacity={isCenter || isActive ? 1 : 0.45}
          fill={isActive ? "currentColor" : "none"}
          data-ui-notation-svg-color="currentColor"
          data-ui-notation-svg-active={isActive ? "true" : undefined}
          data-ui-notation-svg-direction={isCenter ? "center" : segment.direction}
        />
      );
    })}
  </SvgFrame>
);

const renderStickGlyph = (name: string, side: "left" | "right", direction: Direction) => {
  const offset = directionOffsets[direction];
  const targetX = 50 + offset.x;
  const targetY = 50 + offset.y;
  const sideLabel = side === "left" ? "L" : "R";

  return (
    <SvgFrame name={name}>
      <circle
        r="30"
        cx="50"
        cy="50"
        fill="none"
        opacity="0.55"
        strokeWidth="7"
        stroke="currentColor"
        data-ui-notation-svg-color="currentColor"
      />
      <path
        fill="none"
        strokeWidth="9"
        stroke="currentColor"
        strokeLinecap="round"
        d={`M50 50 L${targetX} ${targetY}`}
        data-ui-notation-svg-active="true"
        data-ui-notation-svg-direction={direction}
      />
      <circle cx={targetX} cy={targetY} fill="currentColor" r="9" />
      <text
        x="27"
        y="29"
        fontSize="28"
        fontWeight="800"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="middle"
        data-ui-notation-svg-stick={side}
        fontFamily="system-ui, sans-serif"
      >
        {sideLabel}
      </text>
    </SvgFrame>
  );
};

const renderControllerBadge = (glyph: string) => (
  <span
    aria-hidden="true"
    data-ui-notation-badge={glyph}
    className="px-0.5 text-[11px] font-bold leading-none tracking-normal"
  >
    {glyph}
  </span>
);

const renderControllerSymbol = (platformGlyph: PlatformGlyph, iconName: string) => {
  const { symbol } = platformGlyph;

  if (!symbol) {
    return renderControllerBadge(platformGlyph.glyph);
  }

  switch (symbol.kind) {
    case "badge":
      return renderControllerBadge(platformGlyph.glyph);
    case "dpad":
      return renderDpadGlyph(createRegistrySvgName(iconName), symbol.direction);
    case "stick":
      return renderStickGlyph(createRegistrySvgName(iconName), symbol.side, symbol.direction);
  }

  const unhandledSymbol: never = symbol;
  return unhandledSymbol;
};

const renderPlatformGlyph = (platformGlyph: PlatformGlyph, iconName: string) => {
  const { platform } = platformGlyph;

  switch (platform) {
    case "fgc":
      return (
        <span aria-hidden="true" data-ui-notation-glyph-shape="fgc">
          {platformGlyph.glyph}
        </span>
      );
    case "playstation":
      return renderPlayStationGlyph(platformGlyph, iconName);
    case "xbox":
      return renderXboxGlyph(platformGlyph, iconName);
  }

  const unhandledPlatform: never = platform;
  return unhandledPlatform;
};

type PlatformGlyphContentValue = Readonly<{
  iconName: string;
  platformGlyph: PlatformGlyph;
}>;

function PlatformGlyphContent({ value }: PresentContentProps<PlatformGlyphContentValue>) {
  return renderPlatformGlyph(value.platformGlyph, value.iconName);
}

PlatformGlyphContent.displayName = "PlatformGlyphContent";

const getTextGlyph = (descriptor: UiNotationIconDescriptor) =>
  directionGlyphs[descriptor.iconName] ??
  displayModeGlyphs[descriptor.iconName] ??
  compactTokenLabels[descriptor.iconName] ??
  descriptor.displayLabel;

function TextGlyphFallback({ descriptor }: Readonly<{ descriptor: UiNotationIconDescriptor }>) {
  return <span aria-hidden="true">{getTextGlyph(descriptor)}</span>;
}

TextGlyphFallback.displayName = "TextGlyphFallback";

export const NotationIcon = (props: NotationIconProps) => {
  const { descriptor, tone = "neutral" } = props;
  const platformGlyph = platformGlyphs[descriptor.iconName];
  const isInvalid = descriptor.iconName === "notation-unknown" || descriptor.state === "invalid";
  const commandAccent = Boolean(props.commandAccent && !isInvalid);
  const platformGlyphContent: PlatformGlyphContentValue | undefined = platformGlyph
    ? { iconName: descriptor.iconName, platformGlyph }
    : undefined;

  return (
    <span
      role="img"
      aria-label={descriptor.accessibleLabel}
      data-ui-notation-kind={descriptor.kind}
      data-ui-notation-mode={descriptor.mode}
      data-ui-notation-icon={descriptor.iconName}
      data-ui-notation-glyph={platformGlyph?.glyph ?? getTextGlyph(descriptor)}
      data-ui-notation-platform={platformGlyph?.platform ?? descriptor.mode.toLowerCase()}
      className={cx(
        indicatorRecipe({
          state: isInvalid ? "invalid" : "idle",
          tone: isInvalid ? "destructive" : tone,
        }),
        "h-6 min-w-6 px-1.5",
        commandAccent && "border-(--ui-command-accent)",
      )}
    >
      <Present
        value={platformGlyphContent}
        fallback={<TextGlyphFallback descriptor={descriptor} />}
      >
        {PlatformGlyphContent}
      </Present>
    </span>
  );
};
