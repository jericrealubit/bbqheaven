import { loadMenu } from "./menu-logic.js";
import { updateBusinessStatus, initLiveCounter } from "./status.js";

export async function loadSections() {
  const sections = ["header", "hero", "menu", "location", "footer"];

  for (const section of sections) {
    try {
      const fileName =
        section === "header" ? "./header.html" : `./${section}.html`;
      const res = await fetch(fileName);
      if (!res.ok) continue;

      const html = await res.text();
      const el = document.getElementById(`${section}-placeholder`);

      if (el) {
        el.innerHTML = html;

        // Initialize specific logic immediately after the relevant HTML is injected
        if (section === "header") {
          initBurgerMenu();
        }
        if (section === "menu") {
          await loadMenu();
          // Force the UI to show 'Starters' as active
          const starterBtn = document.querySelector(
            ".cat-btn[onclick*='starters']",
          );
          if (starterBtn) {
            document
              .querySelectorAll(".cat-btn")
              .forEach((btn) => btn.classList.remove("active-cat"));
            starterBtn.classList.add("active-cat");
          }
        }
        if (section === "footer") {
          // Update year
          const yearEl = document.getElementById("year");
          if (yearEl) yearEl.textContent = new Date().getFullYear();

          // Initialize status and counter
          updateBusinessStatus();
          initLiveCounter();
        }
      }
    } catch (err) {
      console.error(`Failed to load ${section}:`, err);
    }
  }
}

export function initBurgerMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (menuBtn && mobileMenu) {
    menuBtn.onclick = (e) => {
      e.preventDefault();
      const isHidden = mobileMenu.classList.toggle("hidden");

      if (menuIcon) {
        menuIcon.classList.toggle("fa-bars", isHidden);
        menuIcon.classList.toggle("fa-xmark", !isHidden);
      }

      document.body.style.overflow = isHidden ? "" : "hidden";
    };

    // Auto-close menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.onclick = () => {
        mobileMenu.classList.add("hidden");
        if (menuIcon) {
          menuIcon.classList.remove("fa-xmark");
          menuIcon.classList.add("fa-bars");
        }
        document.body.style.overflow = "";
      };
    });
  }
}
