const status = {
  healthy: {
    color: "#16794A",
    label: "Healthy",
    surface: "#EAF7F0",
  },
  attention: {
    color: "#9A5B00",
    label: "Attention",
    surface: "#FFF4D6",
  },
  critical: {
    color: "#B4232F",
    label: "Critical",
    surface: "#FDECEF",
  },
} as const;

export const theme = {
  appearance: "light",
  color: {
    canvas: "#F2F5F8",
    panel: "#FFFFFF",
    panelMuted: "#E8EEF4",
    border: "#CBD6E2",
    borderStrong: "#98A8BA",
    text: "#0B1726",
    textMuted: "#4B5D70",
    primary: "#1557B0",
    primaryPressed: "#0D438D",
    focus: "#003F88",
    cameraBackdrop: "#08111E",
  },
  radius: {
    small: 8,
    medium: 12,
    large: 18,
    pill: 999,
  },
  space: {
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  status,
} as const;

export type WhiteRabbitTheme = typeof theme;
