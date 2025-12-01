"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import "@/styles/squadup.css";
import { dev } from "@/lib/dev";

interface SquadUpConfig {
  image: string;
  root: string;
  userId: number[];
  shoppingCartEnabled: boolean;
  confirmEmail: boolean;
  topics: string[];
  ticketGuardianEnabled: boolean;
  onDomReady: boolean;
  descriptionEnabled: boolean;
  reservedSeatingEnabled: boolean;
  braintreeCustomGatewayClientEnabled: true;
  confirmationUrl: string;
  orderQuestions: { question: string; type: string; required: boolean }[];
  eventId?: number;
}

interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

interface ShoppingCartDetail {
  [key: string]: unknown;
}

interface ViewChangedDetail {
  currentView: string;
}

declare global {
  interface Window {
    squadup: SquadUpConfig;
    __su_ab_listener_installed?: boolean;
    dataLayer?: DataLayerEvent[];
  }
  interface DocumentEventMap {
    shoppingCartUpdated: CustomEvent<ShoppingCartDetail>;
    orderSuccessful: CustomEvent;
    viewChanged: CustomEvent<ViewChangedDetail>;
    createSquadupEmbed: CustomEvent;
  }
}

function nukeSquadUp() {
  dev.log("Nuking all SquadUp elements");
  
  const scripts = document.querySelectorAll('script[src*="squadup.com"]');
  scripts.forEach(s => s.remove());
  
  const stylesheets = document.querySelectorAll('link[href*="squadup.com"]');
  stylesheets.forEach(link => link.remove());
  
  const container = document.getElementById("squadup-checkout");
  if (container) {
    container.innerHTML = "";
  }
  
  const bootstrapNamespace = document.querySelectorAll('.bootstrap-wrapper, [class*="bs-"]');
  bootstrapNamespace.forEach(el => {
    if (!el.closest('.squadup-wrapper')) {
      el.remove();
    }
  });
  
  const modals = document.querySelectorAll('.modal, .modal-backdrop, .modal-open');
  modals.forEach(el => el.remove());
  document.body.classList.remove('modal-open');
  
  const squadupElements = document.querySelectorAll('[class*="squadup"]:not(#squadup-checkout):not(.squadup-wrapper):not(.squadup-loading)');
  squadupElements.forEach(el => {
    if (!el.closest('.squadup-wrapper')) {
      el.remove();
    }
  });
  
  const popups = document.querySelectorAll('[id*="squadup"], [class*="checkout-"]');
  popups.forEach(el => {
    if (el.id !== 'squadup-checkout' && !el.closest('.squadup-wrapper')) {
      el.remove();
    }
  });
}

function initEventList(instanceId: string) {
  dev.log("initEventList called", instanceId);
  const container = document.getElementById("squadup-checkout");
  if (!container) return;

  if (container.dataset.customized === instanceId) {
    dev.log("Already customized for this instance, skipping");
    return;
  }

  container.style.opacity = "0";

  const observer = new MutationObserver(() => {
    const eventElement = document.querySelector('button[data-squadup-event-id="121232"]');
    if (eventElement) {
      observer.disconnect();
      
      if (container.dataset.customized === instanceId) {
        dev.log("Already customized (race condition), skipping");
        container.style.opacity = "1";
        return;
      }
      
      dev.log("Found event element, customizing");
      container.dataset.customized = instanceId;

      const parent = eventElement.parentElement;
      if (!parent) return;

      const secondChild = parent.children[1];
      if (secondChild && secondChild !== eventElement) {
        parent.insertBefore(eventElement, secondChild);
      }

      const dateDiv = eventElement.querySelector(".date");
      if (dateDiv && !dateDiv.querySelector('.three-day-pass-icon')) {
        dateDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="three-day-pass-icon"><path fill-rule="evenodd" d="m10.5036 0.334351 1.2074 0.323523 3.1392 0.841166 1.2074 0.32352 -0.3235 1.20741 -0.1941 0.72444c-0.1429 0.53347 0.1736 1.0818 0.7071 1.22475 0.5335 0.14294 1.0818 -0.17364 1.2248 -0.70711l0.1941 -0.72444 0.3235 -1.20741 1.2074 0.32352 3.1393 0.84116 1.2074 0.32353 -0.3236 1.2074 -4.3999 16.42079 -0.3235 1.2074 -1.2074 -0.3236 -3.4232 -0.9172 -8.36243 2.2407L0.456604 4.82833 6.01068 3.34012l0.51764 1.93186c0.14294 0.53346 0.69127 0.85004 1.22474 0.7071 0.53347 -0.14294 0.85005 -0.69128 0.70711 -1.22474l-0.51764 -1.93185 2.04087 -0.54686 0.1966 -0.73387 0.3236 -1.207409ZM18.834 11.7454l-1.2739 4.7542 0 -0.0001 -0.8313 3.1024 -8.2103 -2.1999 2.1052 -7.85673 1.4488 0.38822 0.6471 -2.41482 -1.4489 -0.38821 1.0006 -3.73425 0.7587 0.20329c-0.0128 0.10632 -0.0206 0.21239 -0.0236 0.31794 -0.0019 0.07035 -0.0018 0.14046 0.0005 0.21027 0.0485 1.50113 1.0674 2.85743 2.5932 3.26626 1.7031 0.45636 3.4496 -0.42552 4.1229 -2.00108l0.7587 0.20328 -1.0006 3.73437 -1.449 -0.38824 -0.647 2.4148 1.4489 0.3883Zm-2.8992 -0.7771 -2.4148 -0.6471 0.647 -2.41479 2.4148 0.64705 -0.647 2.41484Z" clip-rule="evenodd" /></svg>';
      }

      if (!eventElement.nextElementSibling?.classList.contains('divider')) {
        const divider = document.createElement("div");
        divider.className = "divider faint event-list";
        eventElement.after(divider);
      }

      parent.querySelectorAll("button[data-squadup-event-id]").forEach((event) => {
        if (event === eventElement) return;

        const dateDiv = event.querySelector(".date");
        const startAt = event.querySelector(".start-at");

        if (!dateDiv || !startAt) return;
        
        if (dateDiv.querySelector('.day-of-week')) {
          return;
        }

        const timeSpans = startAt.querySelectorAll("span");
        const timeText = timeSpans[timeSpans.length - 1]?.textContent || "";

        const dayNumber = dateDiv.querySelector(".number span")?.textContent || "";
        const monthAbbr = dateDiv.querySelector(".month-abbr span")?.textContent || "";

        if (!dayNumber || !monthAbbr) {
          dev.log("Missing date data, skipping element");
          return;
        }

        let dayOfWeek = "";
        if (dayNumber === "5") dayOfWeek = "Fri";
        else if (dayNumber === "6") dayOfWeek = "Sat";
        else if (dayNumber === "7") dayOfWeek = "Sun";

        let daySuffix = "th";
        const dayNum = parseInt(dayNumber);
        if (dayNum === 1 || dayNum === 21 || dayNum === 31) daySuffix = "st";
        else if (dayNum === 2 || dayNum === 22) daySuffix = "nd";
        else if (dayNum === 3 || dayNum === 23) daySuffix = "rd";

        const calDate = monthAbbr + " " + dayNumber + daySuffix;

        dateDiv.innerHTML = `
          <span class="day-of-week">${dayOfWeek}</span>
          <span class="cal-date">${calDate}</span>
          <span class="cal-time">${timeText}</span>
        `;
      });

      container.style.transition = "opacity 0.3s ease";
      container.style.opacity = "1";
      dev.log("Customization complete");
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  setTimeout(() => observer.disconnect(), 10000);
}

export function SquadUpCheckout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const instanceIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const cleanedUpRef = useRef(false);

  const getUrlParameter = useCallback((name: string): string => {
    const escapedName = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + escapedName + "=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }, []);

  useEffect(() => {
    const instanceId = instanceIdRef.current;
    cleanedUpRef.current = false;
    dev.log("Component mounted - FRESH START", instanceId);

    nukeSquadUp();

    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href = "https://s3.amazonaws.com/checkout.squadup.com/default/css/bootstrap-namespace.min.css";
    bootstrapLink.dataset.squadupInstance = instanceId;
    document.head.appendChild(bootstrapLink);

    window.squadup = {
      image: "https://s3.amazonaws.com/checkout.squadup.com/squadup-logo.png",
      root: "squadup-checkout",
      userId: [10114191],
      shoppingCartEnabled: true,
      confirmEmail: true,
      topics: ["wsf-live"],
      ticketGuardianEnabled: false,
      onDomReady: false,
      descriptionEnabled: true,
      reservedSeatingEnabled: true,
      braintreeCustomGatewayClientEnabled: true,
      confirmationUrl: "https://worldsevensfootball.com/confirmation",
      orderQuestions: [
        { question: "Address", type: "text", required: true },
        { question: "City", type: "text", required: true },
        { question: "State", type: "text", required: true },
        { question: "Zip Code", type: "text", required: true },
        { question: "Phone Number", type: "text", required: true },
      ],
    };

    const eventTopic = getUrlParameter("event-topic");
    if (eventTopic) {
      window.squadup.topics = [eventTopic];
    }

    const eventId = getUrlParameter("event-id");
    if (eventId) {
      window.squadup.eventId = parseInt(eventId, 10);
    }

    if (!window.__su_ab_listener_installed) {
      window.__su_ab_listener_installed = true;
      window.dataLayer = window.dataLayer || [];

      const push = (evt: DataLayerEvent) => window.dataLayer?.push(evt);
      let hasItems = false;
      let purchased = false;
      let fired = false;

      document.addEventListener("shoppingCartUpdated", (e) => {
        const cart = e.detail || {};
        hasItems = !!cart && Object.keys(cart).length > 0;
      }, false);

      document.addEventListener("orderSuccessful", () => {
        purchased = true;
        hasItems = false;
      }, false);

      const fireAbandonOnce = () => {
        if (!fired && hasItems && !purchased) {
          fired = true;
          push({ event: "cart_abandon" });
        }
      };

      window.addEventListener("pagehide", fireAbandonOnce);
      window.addEventListener("beforeunload", fireAbandonOnce);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") fireAbandonOnce();
      });

      if (/^\/confirmation(?:\/|$)/.test(window.location.pathname)) {
        purchased = true;
      }
    }

    const viewChangedHandler = (e: Event) => {
      const customEvent = e as CustomEvent<ViewChangedDetail>;
      if (cleanedUpRef.current) return;
      if (customEvent.detail?.currentView === "eventList") {
        dev.log("eventList", instanceId);
        initEventList(instanceId);
      }
    };
    document.addEventListener("viewChanged", viewChangedHandler);

    const script = document.createElement("script");
    script.src = "https://s3.amazonaws.com/checkout.squadup.com/main-v2.min.js";
    script.async = true;
    script.dataset.squadupInstance = instanceId;
    script.onload = () => {
      if (cleanedUpRef.current) return;
      dev.log("Script loaded", instanceId);
      setIsLoading(false);
      
      const waitForReady = setInterval(() => {
        if (cleanedUpRef.current) {
          clearInterval(waitForReady);
          return;
        }
        if (window.squadup && document.getElementById("squadup-checkout")) {
          clearInterval(waitForReady);
          dev.log("SquadUp ready", instanceId);
          setTimeout(() => {
            if (cleanedUpRef.current) return;
            const container = document.getElementById("squadup-checkout");
            if (container) {
              dev.log("Dispatching createSquadupEmbed", instanceId);
              container.style.opacity = "0";
              document.dispatchEvent(new CustomEvent("createSquadupEmbed"));
            }
          }, 100);
        }
      }, 50);
    };
    document.body.appendChild(script);

    return () => {
      dev.log("Component unmounting - FULL CLEANUP", instanceId);
      cleanedUpRef.current = true;
      
      document.removeEventListener("viewChanged", viewChangedHandler);
      
      nukeSquadUp();
      
      const instanceElements = document.querySelectorAll(`[data-squadup-instance="${instanceId}"]`);
      instanceElements.forEach(el => el.remove());
    };
  }, [getUrlParameter]);

  return (
    <div className="squadup-wrapper">
      {isLoading && (
        <div className="squadup-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div id="squadup-checkout" ref={containerRef}></div>
    </div>
  );
}
