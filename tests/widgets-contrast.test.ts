import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// -- WCAG 2.x contrast helpers ----------------------------------------------

// OKLCH -> OKLab -> LMS -> linear sRGB -> WCAG relative luminance
function oklchLuminance(l: number, c: number, hDeg: number): number {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const l2 = l_ ** 3;
  const m2 = m_ ** 3;
  const s2 = s_ ** 3;
  const r = 4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2;
  const g = -1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2;
  const bl = -0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s2;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(bl);
}

function contrastRatio(fg: number, bg: number): number {
  const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
  return (hi + 0.05) / (lo + 0.05);
}

// -- Installed Tailwind v4 palette (oklch values are the ground truth) -------

const themeCss = readFileSync(
  new URL("../node_modules/tailwindcss/theme.css", import.meta.url),
  "utf8",
);

const palette: Record<string, number> = {};
for (const m of themeCss.matchAll(/--color-([a-z]+-\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g)) {
  palette[m[1]] = oklchLuminance(Number(m[2]) / 100, Number(m[3]), Number(m[4]));
}

// The brand ramp is project-owned (see src/styles/global.css), not Tailwind's
// default blue, so the widget contracts below must read the actual tokens.
const globalCss = readFileSync(
  new URL("../src/styles/global.css", import.meta.url),
  "utf8",
);
const accent: Record<string, number> = {};
for (const m of globalCss.matchAll(/--color-accent-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g)) {
  accent[m[1]] = oklchLuminance(Number(m[2]) / 100, Number(m[3]), Number(m[4]));
}

const WHITE = 1; // light body surface: bg-white
const DARK = palette["gray-900"]; // dark body surface: dark:bg-gray-900
const DARK_CARD = palette["gray-800"]; // dark card surface: dark:bg-gray-800

// -- Source contracts (no renderer available for .astro in unit tests) -------

const header = readFileSync(
  new URL("../src/layouts/components/common/Header.astro", import.meta.url),
  "utf8",
);
const tabs = readFileSync(
  new URL("../src/layouts/components/widgets/Tabs.astro", import.meta.url),
  "utf8",
);
const button = readFileSync(
  new URL("../src/layouts/components/widgets/Button.astro", import.meta.url),
  "utf8",
);

describe("widget contrast (WCAG 1.4.3 text >= 4.5:1, 1.4.11 UI >= 3:1)", () => {
  it("active tab label passes in both modes on body and card surfaces", () => {
    expect(contrastRatio(accent["700"], WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent["400"], DARK)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent["400"], DARK_CARD)).toBeGreaterThanOrEqual(4.5);
  });

  it("inactive tab label passes in both modes", () => {
    expect(contrastRatio(palette["gray-500"], WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette["gray-400"], DARK)).toBeGreaterThanOrEqual(4.5);
  });

  it("solid button white text passes on every color in both modes", () => {
    const bgs = [accent["600"], accent["700"], palette["green-700"], palette["red-600"], palette["purple-600"], palette["gray-600"]];
    for (const bg of bgs) {
      expect(contrastRatio(WHITE, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("outline button text passes on light surfaces", () => {
    const fgs = [accent["600"], palette["green-700"], palette["red-600"], palette["purple-600"], palette["gray-600"]];
    for (const fg of fgs) {
      expect(contrastRatio(fg, WHITE)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("outline button text passes on dark body and card surfaces", () => {
    const fgs = [accent["400"], palette["green-400"], palette["red-400"], palette["purple-400"], palette["gray-400"]];
    for (const fg of fgs) {
      expect(contrastRatio(fg, DARK)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(fg, DARK_CARD)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("outline button borders stay visible (>= 3:1) in both modes", () => {
    const lightFgs = [accent["600"], palette["green-700"], palette["red-600"], palette["purple-600"], palette["gray-600"]];
    const darkFgs = [accent["400"], palette["green-400"], palette["red-400"], palette["purple-400"], palette["gray-400"]];
    for (const fg of lightFgs) {
      expect(contrastRatio(fg, WHITE)).toBeGreaterThanOrEqual(3);
    }
    for (const fg of darkFgs) {
      expect(contrastRatio(fg, DARK)).toBeGreaterThanOrEqual(3);
    }
  });

  it("brand ramp pairs used across the theme stay AA", () => {
    // Links and solid buttons.
    expect(contrastRatio(accent["600"], WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(WHITE, accent["600"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(WHITE, accent["700"])).toBeGreaterThanOrEqual(4.5);
    // Dark-mode link text on body and card surfaces.
    expect(contrastRatio(accent["400"], DARK)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent["400"], DARK_CARD)).toBeGreaterThanOrEqual(4.5);
    // Chips: accent-700 on accent-100 (light), accent-300 on accent-900 (dark).
    expect(contrastRatio(accent["700"], accent["100"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent["300"], accent["900"])).toBeGreaterThanOrEqual(4.5);
    // Icons keep the logo hue visible on both surfaces (UI >= 3:1).
    expect(contrastRatio(accent["500"], WHITE)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(accent["500"], DARK)).toBeGreaterThanOrEqual(3);
  });
});

describe("widget source contracts", () => {
  it("desktop dropdown has no hover reveal; only data-open opens it", () => {
    expect(header).not.toMatch(/\.desktop-dropdown:hover/);
    expect(header).toMatch(/\.desktop-dropdown\[data-open="true"\] \.desktop-dropdown-menu/);
  });

  it("tabs do not hide panels before enhancement", () => {
    expect(tabs).not.toMatch(/\.tabs-container:not\(\[data-tabs-ready\]\)/);
  });

  it("button never emits a '#' href; no destination renders a <button>", () => {
    expect(button).not.toMatch(/\|\|\s*['"]#['"]/); // silent fallback removed
    expect(button).toMatch(/candidate !== '#'/); // '#' is filtered out, never emitted
    expect(button).toMatch(/ButtonTag = btnHref \? 'a' : 'button'/);
  });
});
