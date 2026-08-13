"use client";

import { useEffect, useState } from "react";

import {
  detectIosLikePlatform,
  resolveInstallState,
} from "../lib/pwa/install-state";

type DeferredInstallPrompt = Event &
  Readonly<{
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }>;

type NavigatorWithStandalone = Navigator & Readonly<{ standalone?: boolean }>;

export function ServiceWorkerRegistration() {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [displayModeStandalone, setDisplayModeStandalone] = useState(false);
  const [iosLike, setIosLike] = useState(false);
  const [iosNavigatorStandalone, setIosNavigatorStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<DeferredInstallPrompt | null>(null);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const navigatorWithStandalone = navigator as NavigatorWithStandalone;

    setDisplayModeStandalone(standaloneQuery.matches);
    setIosNavigatorStandalone(navigatorWithStandalone.standalone === true);
    setIosLike(
      detectIosLikePlatform({
        maxTouchPoints: navigator.maxTouchPoints,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
      }),
    );
    setReady(true);

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      setDisplayModeStandalone(event.matches);
    };
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallPrompt);
    };
    const handleInstalled = () => {
      setDisplayModeStandalone(true);
      setInstallPrompt(null);
    };

    standaloneQuery.addEventListener("change", handleDisplayModeChange);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    let removeLoadListener: (() => void) | undefined;
    if ("serviceWorker" in navigator) {
      const register = () => {
        void navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .catch(() => undefined);
      };

      if (document.readyState === "complete") {
        register();
      } else {
        window.addEventListener("load", register, { once: true });
        removeLoadListener = () => window.removeEventListener("load", register);
      }
    }

    return () => {
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      removeLoadListener?.();
    };
  }, []);

  if (!ready || dismissed) return null;

  const installState = resolveInstallState({
    displayModeStandalone,
    iosLike,
    iosNavigatorStandalone,
    promptAvailable: installPrompt !== null,
  });

  if (installState === "INSTALLED" || installState === "UNAVAILABLE") {
    return null;
  }

  async function requestInstall() {
    if (!installPrompt) return;
    const prompt = installPrompt;
    setInstallPrompt(null);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "dismissed") setDismissed(true);
    } catch {
      setDismissed(true);
    }
  }

  return (
    <aside className="pwa-install-card" aria-label="Install WhiteRabbit">
      <button
        aria-label="Dismiss install guidance"
        className="pwa-install-dismiss"
        onClick={() => setDismissed(true)}
        type="button"
      >
        ×
      </button>
      <span className="mono-label">INSTALLABLE PWA</span>
      <strong>Keep WhiteRabbit on this device.</strong>
      {installState === "PROMPT_AVAILABLE" ? (
        <>
          <p>Install the light-only app for a focused, standalone workspace.</p>
          <button
            className="button button-primary button-compact"
            onClick={() => void requestInstall()}
            type="button"
          >
            Install app
          </button>
        </>
      ) : (
        <p>
          On iPhone or iPad, open this page in Safari, tap Share, then choose
          Add to Home Screen.
        </p>
      )}
    </aside>
  );
}
