"use client";
import { useEffect, useRef, useCallback } from "react";
import { dev } from "@/lib/dev";
import "@/styles/squadup.css";

declare global {
  interface Window {
    initSquadUpEmbed?: () => void;
    squadup?: unknown;
    __squadup_viewchanged_listener?: boolean;
    __su_ab_listener_installed?: boolean;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

export function SquadUpCheckout() {
  const hasInitialized = useRef(false);
  const scriptsLoaded = useRef(false);

  const initEmbed = useCallback(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (window.initSquadUpEmbed) {
      window.initSquadUpEmbed();
    }
  }, []);

  useEffect(() => {
    hasInitialized.current = false;
    scriptsLoaded.current = false;

    delete window.squadup;
    delete window.initSquadUpEmbed;
    delete window.__squadup_viewchanged_listener;

    async function loadAllScripts() {
      try {
        await loadScript("/scripts/squadup-config.js");
        await loadScript("/scripts/squadup-init.js");
        await loadScript(
          "https://s3.amazonaws.com/checkout.squadup.com/main-v2.min.js"
        );
        scriptsLoaded.current = true;
        initEmbed();
      } catch (err) {
        dev.log("SquadUp script loading error:", err);
      }
    }

    loadAllScripts();

    return () => {
      hasInitialized.current = false;
      scriptsLoaded.current = false;

      const container = document.getElementById("squadup-checkout");
      if (container) {
        container.innerHTML = "";
      }

      document
        .querySelectorAll(
          'script[src*="squadup"], script[src*="/scripts/squadup"]'
        )
        .forEach((s) => s.remove());

      delete window.squadup;
      delete window.initSquadUpEmbed;
      delete window.__squadup_viewchanged_listener;
    };
  }, [initEmbed]);

  return (
    <div className="squadup-wrapper">
      <link
        rel="stylesheet"
        href="https://s3.amazonaws.com/checkout.squadup.com/default/css/bootstrap-namespace.min.css"
      />
      <div id="squadup-checkout"></div>
    </div>
  );
}
