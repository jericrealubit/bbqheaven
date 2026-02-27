# BBQ Heaven Mandurah - Website Mockup

An authentic, modern, and mobile-responsive landing page for **BBQ Heaven Mandurah**. Built with a modular architecture for easy maintenance and high-performance SEO.

## 🚀 Quick Start (Local Development)

Because this project uses the `fetch()` API to load modular components (Header, Hero, Menu, etc.), modern browsers will block the site if opened as a local file due to **CORS security policies**.

**To view the site locally, you MUST use a local server:**

1.  **VS Code:** Install the **Live Server** extension. Right-click `index.html` and select "Open with Live Server".
2.  **Python:** Run `python -m http.server` in the project folder and visit `localhost:8000`.
3.  **Netlify:** Drag the folder into [Netlify Drop](https://app.netlify.com/drop) for instant deployment.

---

## 📂 Project Structure

The project is split into reusable components to make updates simple:

- `index.html` - The main container and layout script.
- `header.html` - Navigation bar and branding.
- `hero.html` - The "Carousel-style" high-impact header.
- `menu.html` - The 3-column grid of menu items and prices.
- `location.html` - Google Maps embed and contact details.
- `footer.html` - Social links and copyright info.
- `style.css` - Custom Tailwind v4 theme configurations.

---

## 🛠 Tech Stack

- **HTML5 & JavaScript (Vanilla):** Used for structural logic and component loading.
- **Tailwind CSS v4:** Utility-first styling with a custom "Pitmaster" theme (Amber/Charcoal).
- **Google Fonts:** Oswald (Headings) and Inter (Body).
- **Font Awesome:** For social and contact icons.
- **JSON-LD Schema:** Integrated into `index.html` for local SEO optimization.

---

## 📝 How to Update

### **Changing Prices**

Open `menu.html` and locate the specific item. Update the text inside the `<span>` tag.

### **Updating Opening Hours**

Hours are located in both the `hero.html` (Info Bar) and `location.html`.

### **Adding an Ordering Link**

Replace the placeholder `#order` links in `header.html` and `hero.html` with your GloriaFood or Menulog URL.

---

## 🌐 SEO & Deployment

This site is optimized for **Netlify**.

- **Performance:** Static HTML ensures a 100/100 Lighthouse score.
- **Local SEO:** Ensure you update the `canonical` URL in the `index.html` head once you purchase a custom domain (e.g., `bbqheavenmandurah.com.au`).
