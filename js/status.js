import { supabase } from "./config.js";

/**
 * Initializes the Supabase Presence channel to track live users.
 */
export function initLiveCounter() {
  // 1. Generate a random ID so mobile and desktop are counted separately
  const sessionId = Math.random().toString(36).slice(2, 11);

  const channel = supabaseClient.channel("online-users", {
    config: {
      presence: { key: sessionId },
    },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      // 2. Count all unique keys currently in the state
      const count = Object.keys(state).length;

      const countEl = document.getElementById("user-count");
      if (countEl) {
        countEl.textContent = count;
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // 3. Track this specific session
        await channel.track({
          online_at: new Date().toISOString(),
          device: navigator.userAgent.includes("Mobi") ? "mobile" : "desktop",
        });
      }
    });
}

/**
 * Calculates if the business is open based on Perth/Rockingham time.
 */
export function updateBusinessStatus() {
  const statusText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");
  const hoursHint = document.getElementById("opening-hours-hint");

  if (!statusText) return;

  // Get current time specifically for Rockingham/Perth
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Perth",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "long",
  });

  const parts = formatter.formatToParts(now);
  const day = parts.find((p) => p.type === "weekday").value;
  const hour = parseInt(parts.find((p) => p.type === "hour").value);
  const minute = parseInt(parts.find((p) => p.type === "minute").value);
  const currentTime = hour + minute / 60;

  // Business Hours Data
  const schedule = {
    Monday: [[17, 21]],
    Tuesday: [[17, 21]],
    Wednesday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Thursday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Friday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Saturday: [[11.5, 21]],
    Sunday: [[11.5, 21]],
  };

  const todayHours = schedule[day];
  let isOpen = false;

  todayHours.forEach((window) => {
    if (currentTime >= window[0] && currentTime < window[1]) {
      isOpen = true;
    }
  });

  if (isOpen) {
    statusText.textContent = "Open Now";
    statusText.className = "text-green-500 text-lg uppercase tracking-tighter";
    if (statusDot)
      statusDot.className =
        "h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]";
    if (hoursHint) hoursHint.textContent = "Pit is hot until 9:00 PM";
  } else {
    statusText.textContent = "Closed";
    statusText.className = "text-red-500 text-lg uppercase tracking-tighter";
    if (statusDot) statusDot.className = "h-3 w-3 rounded-full bg-red-500";

    if (hoursHint) {
      if (day === "Monday" || day === "Tuesday") {
        hoursHint.textContent = "Opens at 5:00 PM";
      } else {
        hoursHint.textContent =
          currentTime < 11.5 ? "Opens at 11:30 AM" : "Re-opens at 5:00 PM";
      }
    }
  }
}
