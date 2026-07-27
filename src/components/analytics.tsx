"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import type { Dictionary } from "@/i18n/types";

const STORAGE_KEY = "ellotravel.analytics-consent";

type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function queueConsent(status: "granted" | "denied") {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: status,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function removeAnalyticsCookies() {
  const analyticsCookie = /^(?:_ga|_gid|_gat)/;
  const domains = ["", location.hostname, ".ellotravel.net"];

  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (!name || !analyticsCookie.test(name)) continue;

    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function AnalyticsConsent({
  gaId,
  copy,
}: {
  gaId?: string;
  copy: Dictionary["cookies"];
}) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!gaId) return;

    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "rejected") {
        if (saved === "accepted") queueConsent("granted");
        setConsent(saved);
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [gaId]);

  if (!gaId || !ready) return null;

  const accept = () => {
    queueConsent("granted");
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setSettingsOpen(false);
  };

  const reject = () => {
    const wasAccepted = consent === "accepted";
    if (wasAccepted) {
      queueConsent("denied");
    }
    removeAnalyticsCookies();

    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
    setSettingsOpen(false);

    // Reload after withdrawal so registered analytics listeners cannot send
    // more events during this browser session.
    if (wasAccepted) location.reload();
  };

  const showBanner = consent === null || settingsOpen;

  return (
    <>
      {consent === "accepted" && <GoogleAnalytics gaId={gaId} />}

      {showBanner ? (
        <section
          aria-label={copy.title}
          // Clears the sticky mobile call/book bar, which owns the bottom edge
          // of the screen below the lg breakpoint.
          className="fixed inset-x-3 bottom-[5.25rem] z-[100] mx-auto max-w-3xl rounded-2xl border border-ocean-100 bg-white p-5 shadow-lift sm:p-6 lg:bottom-5"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-ocean-950">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ocean-700">
                {copy.body}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={reject}>
                {copy.reject}
              </Button>
              <Button type="button" onClick={accept}>
                {copy.accept}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-[5.25rem] left-3 z-[90] rounded-full border border-ocean-200 bg-white px-3 py-2 text-xs font-semibold text-ocean-700 shadow-card transition hover:border-ocean-300 hover:text-ocean-950 lg:bottom-5 lg:left-5"
        >
          {copy.settings}
        </button>
      )}
    </>
  );
}
