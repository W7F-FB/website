const colors = {
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    primary: 'oklch(0.205 0 0)',
    'primary-foreground': 'oklch(0.985 0 0)',
  },
  dark: {
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    primary: 'oklch(0.985 0 0)',
    'primary-foreground': 'oklch(0.205 0 0)',
  }
} as const;

function parseRgba(color: string): [number, number, number, number] | null {
  const rgbaMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (rgbaMatch) {
    return [
      parseInt(rgbaMatch[1]),
      parseInt(rgbaMatch[2]),
      parseInt(rgbaMatch[3]),
      rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
    ];
  }
  return null;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

function parseOklch(oklch: string): [number, number, number] | null {
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+%?)?\)/);
  return match 
    ? [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])]
    : null;
}

function resolveCssVariable(cssVar: string): string | null {
  const match = cssVar.match(/var\(--([^)]+)\)/);
  if (!match) return null;
  
  const varName = match[1];
  
  if (typeof window === 'undefined') {
    const theme = colors.dark;
    if (varName in theme) {
      return theme[varName as keyof typeof theme];
    }
    return null;
  }
  
  const root = document.documentElement;
  const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
  
  try {
    const computedValue = getComputedStyle(root).getPropertyValue(`--${varName}`).trim();
    if (computedValue && !computedValue.startsWith('var(')) {
      return computedValue;
    }
  } catch {
  }
  
  const theme = isDark ? colors.dark : colors.light;
  if (varName in theme) {
    return theme[varName as keyof typeof theme];
  }
  
  return null;
}

export function flattenTransparency(
  foreground: string,
  background: string,
  opacity: number
): string {
  let resolvedForeground = foreground;
  let resolvedBackground = background;
  
  if (foreground.startsWith('var(')) {
    const resolved = resolveCssVariable(foreground);
    if (resolved) {
      resolvedForeground = resolved;
    }
  }
  
  if (background.startsWith('var(')) {
    const resolved = resolveCssVariable(background);
    if (resolved) {
      resolvedBackground = resolved;
    }
  }
  
  const fgRgba = parseRgba(resolvedForeground);
  const bgRgba = parseRgba(resolvedBackground);
  
  if (fgRgba && bgRgba) {
    const r = Math.round(bgRgba[0] * (1 - opacity) + fgRgba[0] * opacity);
    const g = Math.round(bgRgba[1] * (1 - opacity) + fgRgba[1] * opacity);
    const b = Math.round(bgRgba[2] * (1 - opacity) + fgRgba[2] * opacity);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  const fgHex = hexToRgb(resolvedForeground);
  const bgHex = hexToRgb(resolvedBackground);
  
  if (fgHex && bgHex) {
    const r = Math.round(bgHex[0] * (1 - opacity) + fgHex[0] * opacity);
    const g = Math.round(bgHex[1] * (1 - opacity) + fgHex[1] * opacity);
    const b = Math.round(bgHex[2] * (1 - opacity) + fgHex[2] * opacity);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  const fg = parseOklch(resolvedForeground);
  const bg = parseOklch(resolvedBackground);
  
  if (fg && bg) {
    const l = bg[0] * (1 - opacity) + fg[0] * opacity;
    const c = bg[1] * (1 - opacity) + fg[1] * opacity;
    const h = bg[2] * (1 - opacity) + fg[2] * opacity;
    
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
  }
  
  return resolvedForeground;
}

