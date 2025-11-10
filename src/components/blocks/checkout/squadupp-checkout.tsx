"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/squadup.css";

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
  braintreeCustomGatewayClientEnabled: boolean;
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

export function SquadUpCheckout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href = "https://s3.amazonaws.com/checkout.squadup.com/default/css/bootstrap-namespace.min.css";
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

    const getUrlParameter = (name: string): string => {
      const escapedName = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + escapedName + "=([^&#]*)");
      const results = regex.exec(window.location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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

    const script = document.createElement("script");
    script.src = "https://s3.amazonaws.com/checkout.squadup.com/main-v2.min.js";
    script.async = true;
    script.onload = () => {
      setIsLoading(false);
      initializeEventList();
    };
    document.body.appendChild(script);

    // Event list initialization
    const initEventList = () => {
      const container = document.getElementById("squadup-checkout");
      if (!container) return;

      container.style.opacity = "0";

      const observer = new MutationObserver(() => {
        const eventElement = document.querySelector('button[data-squadup-event-id="121232"]');
        if (eventElement) {
          observer.disconnect();

          const parent = eventElement.parentElement;
          if (!parent) return;

          const secondChild = parent.children[1];
          if (secondChild && secondChild !== eventElement) {
            parent.insertBefore(eventElement, secondChild);
          }

          const dateDiv = eventElement.querySelector(".date");
          if (dateDiv) {
            dateDiv.innerHTML = '<i class="ph-fill ph-star three-day-pass-icon"></i>';
          }

          const divider = document.createElement("div");
          divider.className = "divider faint event-list";
          eventElement.after(divider);

          parent.querySelectorAll("button[data-squadup-event-id]").forEach((event) => {
            if (event === eventElement) return;

            const dateDiv = event.querySelector(".date");
            const startAt = event.querySelector(".start-at");

            if (!dateDiv || !startAt) return;

            const timeSpans = startAt.querySelectorAll("span");
            const timeText = timeSpans[timeSpans.length - 1]?.textContent || "";

            const dayNumber = dateDiv.querySelector(".number span")?.textContent || "";
            const monthAbbr = dateDiv.querySelector(".month-abbr span")?.textContent || "";

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
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    const initializeEventList = () => {
      const checkInterval = setInterval(() => {
        if (window.squadup && document.getElementById("squadup-checkout")) {
          clearInterval(checkInterval);
          setTimeout(() => {
            const container = document.getElementById("squadup-checkout");
            if (container) {
              container.style.opacity = "0";
              document.dispatchEvent(new CustomEvent("createSquadupEmbed"));
            }
          }, 100);
        }
      }, 50);
    };

    // Listen for view changes
    const handleViewChange = (e: CustomEvent<ViewChangedDetail>) => {
      if (e.detail?.currentView === "eventList") {
        console.log("eventList view detected");
        initEventList();
      }
    };

    document.addEventListener("viewChanged", handleViewChange);

    // Cleanup
    return () => {
      document.removeEventListener("viewChanged", handleViewChange);
      if (bootstrapLink.parentNode) {
        bootstrapLink.parentNode.removeChild(bootstrapLink);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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