# BBQ Heaven — Website Owner Guide

Welcome! You now own the BBQ Heaven Rockingham website, **https://bbqheaven.au**. This guide
explains what you own, how to log in, how to handle day-to-day tasks, and how to keep the site
safe and running.

---

## 1. What you own

Your website is made of five services. Each has its own login, all owned by your business email.

| Service | What it does for you | Where to log in | Cost |
|---------|----------------------|-----------------|------|
| **GitHub** | Stores all website files (pages, menu, photos). Saving a change here updates the site. | https://github.com | Free |
| **Cloudflare** | Hosts the website, provides the padlock (SSL), speed and DNS for your domain | https://dash.cloudflare.com | Free plan |
| **Firebase** (Google) | Stores customer orders and the staff logins for the kitchen dashboard | https://console.firebase.google.com | Free (Spark) unless upgraded |
| **Supabase** | Powers the "people viewing now" counter | https://supabase.com/dashboard | Free plan |
| **Hostmate** | Your domain name registrar — you rent `bbqheaven.au` here every year | https://www.hostmate.com.au (client area) | Yearly renewal fee |

How they connect:

```
Customer → bbqheaven.au (domain, Hostmate)
         → Cloudflare (hosting + DNS) → website files from GitHub
         → orders saved in Firebase → Kitchen dashboard (/admin-dashboard.html)
         → live counter via Supabase
```

---

## 2. Your accounts & logins

- Keep every login in a **password manager** (e.g. Bitwarden, 1Password) — one vault called
  "BBQ Heaven Website".
- **Turn on two-factor authentication (2FA)** on GitHub, Cloudflare, Google, Supabase and
  Hostmate. This is the single best protection for your website.
- Use the **business email** for all accounts so ownership stays with the business if staff
  change.
- Store your **2FA recovery codes** somewhere safe and offline (printed in the office safe).

### Giving someone else access (e.g. a future developer)

Never share your own password. Invite them instead, and remove them when the job is done:

| Service | Invite | Remove |
|---------|--------|--------|
| GitHub | Repo → Settings → Collaborators → Add people | Same page → Remove |
| Cloudflare | Manage Account → Members → Invite | Same page → Remove |
| Firebase | ⚙️ Project settings → Users and permissions → Add member | Same page → ⋮ → Remove |
| Supabase | Organization → Team → Invite | Same page → Remove |

---

## 3. Daily operations — the kitchen dashboard

**Address:** https://bbqheaven.au/admin-dashboard.html (bookmark it on the kitchen tablet).

1. Enter a staff email and password → **LOGIN TO DASHBOARD**.
2. New orders appear **instantly** — no need to refresh. The green **LIVE** dot means it's connected.
3. Tap **Mark Ready** when an order is ready (tap **Undo Ready** if you pressed it by mistake).
4. Tap the **✕** button to **clear** a collected order (it asks to confirm — this deletes it).
5. Tap **Sign Out** at the end of the shift if the tablet is shared.

### Adding or removing staff logins

1. Firebase Console → your project → **Authentication → Users**.
2. **Add user** → enter the staff member's email and a temporary password → tell them in person.
3. When someone leaves: find their email → **⋮ → Delete account** (do it on their last day).

> Tip: use one shared kitchen login (e.g. `kitchen@...`) plus a personal login for managers.

---

## 4. Updating the website content

All content changes are made on GitHub in your browser: open the file → click the **✏️ pencil**
→ change → **Commit changes**. The website updates itself in **1–2 minutes**.

### 4.1 Menu items, prices and photos

👉 Follow the full **[Menu & Price Update Guide](./MENU_UPDATE_GUIDE.md)**.
Quick version: food is in `data/menu1.json`, drinks are in `data/menu2.json`, photos are in
`images/<category>/`.

### 4.2 Opening hours / temporarily closed

The Open/Closed status is calculated automatically from Perth time (AWST) using the hours in
**`js/status.js`**. Find this section:

```js
  const schedule = {
    Monday: [[17, 21]],
    ...
    Friday: [
      [11.5, 14.5],
      [17, 21],
    ],
```

- Each `[start, end]` is a time window in **24-hour time**. Use decimals for minutes:
  `11.5` = 11:30 AM, `14.5` = 2:30 PM, `17` = 5:00 PM, `21` = 9:00 PM, `17.75` = 5:45 PM.
- A day can have several windows (lunch and dinner).
- **Closed all day** (e.g. public holiday or temporary closure): set that day to an empty list:
  `Monday: [],`
- The small hint text ("Opens at 5:00 PM", "Pit is hot until 9:00 PM") is a little further down
  in the same file — update the wording if your hours change.

### 4.3 Phone number, address and social links

| What | File |
|------|------|
| Phone number (header button) | `header.html` (search for `tel:`) |
| Phone, address, Facebook/Instagram/TikTok/YouTube links | `footer.html` |
| Google Map and directions | `location.html` |
| Business details for Google search results | `index.html` (the `application/ld+json` section near the top) |

> When you change your phone number or address, update **all** the files above so they match.
> Then update your **Google Business Profile** too.

---

## 5. How changes go live (and how to undo)

1. You commit a change on GitHub.
2. Cloudflare sees it and rebuilds the site automatically.
3. Check: Cloudflare → **Workers & Pages → bbqheaven → Deployments** (the build log is under
   **Settings → Build** / the latest build) — ✅ green = live.

**To undo a bad change instantly:** Deployments → the last good version → **⋯ → Rollback**.
Then fix the file on GitHub.

> ⚠️ Don't delete or change the **Build variables** in Cloudflare (bbqheaven → Settings → Build →
> Variables and secrets).
> They connect the site to Firebase and Supabase. Without them orders stop working.

---

## 6. Your domain name (bbqheaven.au)

- Registered at **Hostmate**. `.au` domains are rented yearly (or multi-year).
- **Renewal date:** `<<EXPIRY DATE>>` — put a reminder in your calendar 30 days before.
- Make sure **Auto-renew is ON** and the card on file is current. If the domain expires, the
  website and any domain email stop working.
- Keep the **registrant** details (business name, ABN) up to date in Hostmate. auDA requires
  `.au` owners to keep eligibility details accurate — if your ABN or business structure changes,
  update it.
- **Nameservers** at Hostmate must stay pointed at your Cloudflare nameservers. Don't change
  them unless you are moving hosting.
- Be wary of "domain renewal" letters or emails from companies other than Hostmate — these are
  common scams. Only renew through your Hostmate client area.

---

## 7. Billing & costs

| Service | Normal cost | What to watch |
|---------|-------------|---------------|
| Hostmate | Domain renewal yearly | Auto-renew on, card valid |
| Cloudflare | Free plan | Nothing — no card needed |
| GitHub | Free | Nothing |
| Firebase | Free (Spark plan) — plenty for a restaurant | If ever upgraded to Blaze (pay-as-you-go), set a **budget alert** in Google Cloud Billing |
| Supabase | Free | Free projects **pause after ~7 days of no activity**; the live site normally keeps it active. If the counter stops, open the Supabase dashboard and click **Restore project**. |

---

## 8. Security & backups

**Monthly (5 minutes):**
- Firebase → Realtime Database → **⋮ → Export JSON** → save to your business Google Drive/OneDrive
  in a folder named by month.
- GitHub: your code is already backed up with full history. Optional: **Code → Download ZIP**
  every few months.

**Always:**
- Keep 2FA on every account.
- Remove staff dashboard logins on the day someone leaves.
- Never paste the Cloudflare environment variable values (keys) into emails, chats or public places.
- Only invite people you trust to GitHub / Cloudflare / Firebase, and remove them after the job.
- If you think an account was compromised: change its password, check its members list, and
  check recent GitHub commits for changes you didn't make.

---

## 9. Troubleshooting

| Problem | What to check |
|---------|---------------|
| **Website won't load** | Is the domain expired (Hostmate)? Is Cloudflare showing an outage (https://www.cloudflarestatus.com)? Did the last deployment fail? Roll back if needed. |
| **Menu is blank** | A mistake in `menu1.json`/`menu2.json`. Roll back in Cloudflare, then check the file at https://jsonlint.com. |
| **My change isn't showing** | Wait 2 minutes, then hard refresh (Ctrl/Cmd + Shift + R). Check the deployment is ✅ in Cloudflare. |
| **Orders not appearing on the dashboard** | Is the dashboard showing LIVE? Sign out and in again. Check the tablet's internet. Check Firebase status (https://status.firebase.google.com). |
| **Staff can't log in** | Check the email exists in Firebase → Authentication → Users; reset their password there. |
| **Wrong Open/Closed status** | Check the hours in `js/status.js` (24-hour time, Perth time). |
| **Live counter shows nothing** | Supabase project may be paused — open the dashboard and restore it. |
| **Photo not showing** | Photo file name must exactly match the item name and end in `.webp`. |

---

## 10. Maintenance checklist

**Weekly**
- [ ] Place one test order and check it arrives on the dashboard (then delete it)
- [ ] Check the menu and prices are current

**Monthly**
- [ ] Export the Firebase database backup
- [ ] Review staff logins — remove anyone who has left
- [ ] Check opening hours are correct on the site

**Yearly**
- [ ] Renew the domain (or confirm auto-renew worked) — `<<EXPIRY DATE>>`
- [ ] Review who has access to GitHub, Cloudflare, Firebase, Supabase, Hostmate
- [ ] Update copyright/legal pages (`privacy.html`, `terms.html`) if your policies changed
- [ ] Check your Google Business Profile details match the website

---

## 11. Useful contacts & links

| What | Where |
|------|-------|
| Hostmate support | Hostmate client area → Support / Tickets |
| Cloudflare help | https://developers.cloudflare.com/workers/ · https://community.cloudflare.com |
| Firebase help | https://firebase.google.com/support |
| Supabase help | https://supabase.com/docs |
| GitHub help | https://docs.github.com |
| auDA (.au domain rules) | https://www.auda.org.au |
| Developer (support period) | `<<DEVELOPER CONTACT>>` until `<<DATE>>` |

See also: [Website Transfer Plan](./TRANSFER_PLAN.md) · [Menu & Price Update Guide](./MENU_UPDATE_GUIDE.md)
