import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import { theme } from "@whiterabbit/design-tokens";

import { ServiceWorkerRegistration } from "../components/service-worker-registration";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "WhiteRabbit",
  title: {
    default: "WhiteRabbit",
    template: "%s · WhiteRabbit",
  },
  description: "Accountable, edge-first public-sector sensing",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WhiteRabbit",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const themeVariables = {
  "--canvas": theme.color.canvas,
  "--panel": theme.color.panel,
  "--panel-muted": theme.color.panelMuted,
  "--border": theme.color.border,
  "--border-strong": theme.color.borderStrong,
  "--text": theme.color.text,
  "--text-muted": theme.color.textMuted,
  "--primary": theme.color.primary,
  "--primary-pressed": theme.color.primaryPressed,
  "--focus": theme.color.focus,
  "--healthy": theme.status.healthy.color,
  "--healthy-surface": theme.status.healthy.surface,
  "--attention": theme.status.attention.color,
  "--attention-surface": theme.status.attention.surface,
  "--critical": theme.status.critical.color,
  "--critical-surface": theme.status.critical.surface,
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body style={themeVariables}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
