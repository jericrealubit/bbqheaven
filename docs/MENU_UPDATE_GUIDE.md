# BBQ Heaven — Menu & Price Update Guide

This guide shows you how to change menu items, prices and photos yourself — no coding
experience needed. You do everything in your web browser on GitHub, and the website updates
itself about **1–2 minutes** after you save.

---

## 1. Where the menu lives

The menu is stored in two text files in your GitHub repository:

| File | What's in it | Categories (exact names) |
|------|--------------|--------------------------|
| `data/menu1.json` | Food | `starters`, `mains`, `bbq_table`, `kids_corner` |
| `data/menu2.json` | Drinks | `white_wine`, `red_wine`, `sparkling_wines`, `spirits_liquor_shots`, `beer`, `tap_beers`, `soft_drinks_cans`, `juices`, `cocktails_and_mocktails` |

Photos live in folders with the same category names: `images/starters/`, `images/mains/`,
`images/bbq_table/`, `images/kids_corner/`.

> ⚠️ Don't rename or delete categories — the website's category buttons depend on these exact names.

---

## 2. How a menu item is written

Each item is a small block between curly brackets `{ }`:

```json
{
  "name": "Kids Burger & Chips",
  "price": "$14",
  "description": "A junior-sized beef burger with cheese, served with a side of golden chips."
}
```

| Field | Required | What it does |
|-------|----------|--------------|
| `name` | Yes | Item name shown on the menu. Also used to find the photo. |
| `price` | Yes | Price **text** shown on the menu card, e.g. `"$14"`. |
| `description` | Yes | Short description under the name. |
| `options` | Only for items with sizes/choices | List of choices, each with a `label` and a `price` **number**. |

Items with sizes look like this:

```json
{
  "name": "Garlic Bread & Cheese",
  "price": "$10 / $12",
  "description": "Toasted artisan bread smothered in garlic butter and topped with melted cheeses.",
  "options": [
    { "label": "Standard", "price": 10 },
    { "label": "Extra Cheese", "price": 12 }
  ]
}
```

> 💡 **The `options` prices are what the customer is charged.** The `price` text above it is just
> what's displayed on the card. When you change a price, **update both**.

---

## 3. Editing step by step (in your browser)

1. Go to `https://github.com/<your-account>/bbqheaven` and sign in.
2. Click the **`data`** folder, then **`menu1.json`** (food) or **`menu2.json`** (drinks).
3. Click the **✏️ pencil icon** ("Edit this file") at the top right of the file.
4. Press **Ctrl + F** (Windows) or **Cmd + F** (Mac) and type the item name to find it.
5. Make your change (see the recipes in section 4).
6. Click the green **Commit changes…** button.
7. In the box, write a short note like `Update brisket price to $38`, keep
   **"Commit directly to the main branch"** selected, and click **Commit changes**.
8. Wait **1–2 minutes**, then open https://bbqheaven.au and refresh
   (**Ctrl + Shift + R** / **Cmd + Shift + R**, or pull down to refresh on a phone).
9. Check the item looks right and, for price changes, add it to the cart to check the total.

> You can also check progress in Cloudflare: **Workers & Pages → bbqheaven → Deployments**.
> A green ✅ means your change is live. A red ❌ means something went wrong — see section 7.

---

## 4. Recipes (copy, paste, change)

### 4.1 Change the price of a single-price item

Before:
```json
  "price": "$14",
```
After:
```json
  "price": "$15",
```

### 4.2 Change the price of an item with sizes/options

Update **both** the display text and the option numbers:

```json
  "price": "$26 / $45",
  "description": "...",
  "options": [
    { "label": "½ Dozen", "price": 26 },
    { "label": "1 Dozen", "price": 45 }
  ]
```
→ to raise each by $2:
```json
  "price": "$28 / $47",
  "description": "...",
  "options": [
    { "label": "½ Dozen", "price": 28 },
    { "label": "1 Dozen", "price": 47 }
  ]
```

### 4.3 Add a new item

1. Find the category list you want, e.g. `"mains": [`.
2. Find the **last item** in that list (just before the closing `]`).
3. Type a **comma** after its closing `}` and paste the new item:

```json
    {
      "name": "Previous Last Item",
      "price": "$30",
      "description": "..."
    },
    {
      "name": "Smoked Beef Cheeks",
      "price": "$36",
      "description": "Twelve-hour smoked beef cheeks with mash and red wine jus."
    }
  ],
```

To add an item with choices, use the `options` format from section 2.

### 4.4 Remove an item

Delete the whole block from `{` to `}` **and one comma** next to it, so the remaining items are
still separated by exactly one comma and the last item in the list has **no** comma after it.

> 💡 Temporarily sold out? Instead of deleting, you can change the description to start with
> `SOLD OUT —` and put it back later.

### 4.5 Mark an item as gluten-free

Add `(GF)` to the end of the name. The website automatically shows a GF badge and includes it in
the gluten-free filter:

```json
  "name": "Slow Roasted Lamb Shank (GF)",
```

> If the item has a photo, rename the photo too (see section 5) because the name changed.

### 4.6 Move an item to another category

Cut the whole `{ ... }` block from one list and paste it into the other (fix commas as in 4.3 and
4.4). If it has a photo, move the photo to the matching `images/<category>/` folder.

---

## 5. Adding or changing photos

The website finds a photo by its **exact item name**:

```
images/<category>/<exact item name>.webp
```

Example: the item `"Slow Roasted BBQ Beef Brisket"` in `mains` uses
`images/mains/Slow Roasted BBQ Beef Brisket.webp`. Capital letters matter: `Beef` and `beef` are
different names to the website.

Steps:
1. Take a landscape photo (good light, plate centred).
2. Convert it to **WebP** and shrink it at https://squoosh.app (free): drag the photo in, choose
   **WebP**, set width to about **1000 px**, quality **75**, then download. Aim for under 200 KB.
3. Rename the file to **exactly** the item name — same capitals, spaces, brackets and symbols —
   ending in `.webp`.
4. On GitHub open `images` → the category folder → **Add file → Upload files** → drop the photo →
   **Commit changes**.
5. To **replace** a photo, upload one with the same name — GitHub will overwrite it.

If no photo matches, the site shows a neat sketch placeholder instead, so a missing photo never
breaks the menu.

> Drinks don't have photo folders — they use the placeholder.

---

## 6. Rules that keep the menu working

The files use a format called **JSON**. It's strict — one wrong character can stop the menu
loading. Follow these rules:

| ✅ Do | ❌ Don't |
|-------|---------|
| Use straight double quotes `"like this"` | Use curly quotes `“like this”` (often from Word or phones) or single quotes `'` |
| Put a comma **between** items: `},` then `{` | Put a comma after the **last** item in a list |
| Write option prices as plain numbers: `"price": 12` | Write `"price": "$12"` or `"price": 12.00$` in options |
| Use `options` for **any** item with more than one price | Write `"price": "$10 / $12"` without `options` (the cart would read it as $1012) |
| Keep the category names exactly as they are | Rename `starters` to `Starters` |
| Write a `"` inside text as `\"`, or avoid it | Leave an unescaped `"` inside a description |

**Check your edit before saving:** copy the entire file, paste it into https://jsonlint.com and
click **Validate JSON**. "Valid JSON" means it's safe to commit.

---

## 7. Checklist before you commit

- [ ] Price text and option numbers match
- [ ] Commas are correct (no missing commas, no comma after the last item)
- [ ] File passes https://jsonlint.com
- [ ] Photo name matches the item name exactly (if you changed the name)
- [ ] Commit message says what changed

### If something goes wrong (menu is blank or broken)

**Option A — undo on GitHub (recommended):**
1. Open the file on GitHub → click **History** (clock icon).
2. Open your last change, compare, and either fix the mistake with the ✏️ pencil, or copy the
   previous version's content back in and commit.

**Option B — instant rollback in Cloudflare:**
1. Cloudflare → **Workers & Pages → bbqheaven → Deployments**.
2. Find the last version that worked → **⋯ → Rollback**.
3. The old menu is live again within seconds. Then fix the file on GitHub calmly (your next
   commit will deploy normally).

---

## 8. Quick reference

| I want to… | Go to | Change |
|-----------|-------|--------|
| Change a food price | `data/menu1.json` | `price` (+ `options` prices) |
| Change a drink price | `data/menu2.json` | `price` (+ `options` prices) |
| Add a dish | `data/menu1.json` | Add a `{ }` block to the category |
| Mark gluten-free | menu file | Add `(GF)` to `name` |
| Add/replace a photo | `images/<category>/` | Upload `<exact name>.webp` |
| Undo a mistake | Cloudflare Deployments | Rollback to previous deployment |
