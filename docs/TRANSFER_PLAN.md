# BBQ Heaven Rockingham — Website Transfer Plan

**Website:** https://bbqheaven.au
**Transferring from:** Jeric Realubit (Developer)
**Transferring to:** `<<CLIENT NAME / BUSINESS ENTITY>>` (Client), ABN `<<CLIENT ABN>>`
**Target handover date:** `<<DD/MM/YYYY>>`
**Document version:** 1.0

This is the step-by-step runbook for moving full ownership of the BBQ Heaven website (code,
database, hosting and domain name) from the developer to the client. Work through it in order.
Each step says **who** does it and how to **✅ verify** it worked before moving on.

> **Golden rules**
> 1. **Build the new setup first, switch over second, shut down the old one last.** The live site
>    stays up the whole time.
> 2. **Never send passwords or keys over email or SMS.** Use a password manager share
>    (e.g. Bitwarden, 1Password) or enter them together on a call.
> 3. **Back everything up before changing anything** (Phase 0).
> 4. **Use a business email** (e.g. `admin@bbqheaven.au` or a dedicated Gmail) for every account,
>    not a staff member's personal email, so ownership stays with the business.

---

## 1. What is being transferred

| # | Asset | Provider | What it does | Current owner | New owner | Transfer method | Done |
|---|-------|----------|--------------|---------------|-----------|-----------------|------|
| 1 | Source code | GitHub (`jericrealubit/bbqheaven`) | All website files, menu, images | Developer | Client | GitHub repository transfer | ☐ |
| 2 | Website hosting | Cloudflare Workers (Worker `bbqheaven`, deployed by Workers Builds) | Serves the site, SSL, CDN, auto-deploy | Developer | Client | Re-create the Worker in client's Cloudflare account | ☐ |
| 3 | Orders database + staff logins | Firebase (Realtime Database + Authentication) | Stores customer orders, kitchen dashboard logins | Developer | Client | Add client as Owner, then remove developer | ☐ |
| 4 | Live visitor counter | Supabase (Realtime presence only, no tables) | "People viewing now" counter | Developer | Client | New project in client's account (or transfer org) | ☐ |
| 5 | Domain name `bbqheaven.au` | Hostmate (registrar) | The web address | `<<REGISTRANT NAME>>` | Client | Hostmate account push + auDA change of registrant if needed | ☐ |
| 6 | DNS records | Cloudflare (nameservers) | Points the domain at the site (+ any email) | Developer | Client | Re-create zone in client's Cloudflare | ☐ |
| 7 | Environment variables (9 keys) | Cloudflare Worker → Settings → Build (build variables) | Connects the site to Firebase & Supabase | Developer | Client | Re-entered in client's Cloudflare | ☐ |
| 8 | Google Search Console / Google Business Profile | Google | Search listing & Maps | `<<OWNER>>` | Client | Add client as Owner | ☐ |
| 9 | Social links (Facebook, Instagram, TikTok, YouTube) | Meta / TikTok / Google | Linked from site footer | Client | Client | No change — just confirm URLs | ☐ |

### Technical facts (for whoever performs the transfer)

- **Site type:** static HTML + vanilla JavaScript (no server to move). Tailwind, Firebase SDK and
  Supabase SDK load from CDNs.
- **Hosting:** a Cloudflare **Worker** named `bbqheaven` that serves the repository's files as
  static assets (`wrangler.jsonc` → `assets.directory: "."`). **Workers Builds** connects it to
  GitHub and redeploys on every push to `main`; other branches get `*.workers.dev` preview URLs.
- **Build command:** `npm run build` → runs `generate-env.js`, which writes `env.js` from
  environment variables. **Deploy command:** `npx wrangler deploy`. Files listed in
  `.wranglerignore` are not uploaded.
- **Build variables required by the build** (values are *not* in the repo — `.env` and
  `env.js` are git-ignored). Because `env.js` is generated during the build, these must be
  **build** variables (Worker → Settings → Build → Variables and secrets), not runtime variables:

  | Variable | Source |
  |----------|--------|
  | `SUPABASE_URL` | Supabase → Project Settings → API |
  | `SUPABASE_KEY` | Supabase → Project Settings → API → `anon` public key |
  | `ADMIN_FIREBASE_API_KEY` | Firebase → Project settings → Your apps → Web app config |
  | `ADMIN_FIREBASE_AUTH_DOMAIN` | same |
  | `ADMIN_FIREBASE_DATABASE_URL` | same |
  | `ADMIN_FIREBASE_PROJECT_ID` | same |
  | `ADMIN_FIREBASE_STORAGE_BUCKET` | same |
  | `ADMIN_FIREBASE_MESSAGING_SENDER_ID` | same |
  | `ADMIN_FIREBASE_APP_ID` | same |

- **Firebase data:** `orders` node (customers write new orders from `js/order-system.js`;
  kitchen dashboard reads/updates/deletes from `dashboard/admin-logic.js`). Staff log in with
  Firebase Authentication (email + password) at `/admin-dashboard.html`.
- **Supabase:** used only for a Realtime Presence channel named `online-users`
  (`js/status.js`). There are no tables or data to migrate.

---

## 2. Pre-transfer checklist (Client)

Complete these **before** the handover day.

- [ ] Choose the business email that will own every account: `<<BUSINESS EMAIL>>`
- [ ] Install a password manager and create a "BBQ Heaven Website" vault.
- [ ] Create the following accounts with the business email and **turn on two-factor
      authentication (2FA)** on each:
  - [ ] GitHub — https://github.com/signup (free plan is fine)
  - [ ] Cloudflare — https://dash.cloudflare.com/sign-up (free plan is fine)
  - [ ] Google account (for Firebase) — https://accounts.google.com
  - [ ] Supabase — https://supabase.com/dashboard (sign in with GitHub or email)
  - [ ] Hostmate — https://www.hostmate.com.au (client area account)
- [ ] Have the business **ABN** and legal entity name ready (required for `.au` domains by auDA).
- [ ] Have a business credit/debit card ready for domain renewal and any paid plan.
- [ ] Send the developer your **GitHub username**, **Google account email** and
      **Hostmate account email/ID** (these are not secret).

**Developer pre-checks:**

- [ ] Confirm current domain expiry date: `<<EXPIRY DATE>>` (if it's within 30 days, renew first).
- [ ] Confirm who is listed as **registrant** (legal owner) of `bbqheaven.au` in Hostmate:
      `<<REGISTRANT NAME / ABN>>`.
- [ ] List any email services on the domain (MX records) so they are not broken: `<<NONE / PROVIDER>>`.
- [ ] Agree a handover window with the client — pick a **quiet time** (e.g. Monday–Thursday
      before 5:00 PM AWST, when the shop is closed).

---

## 3. Phase 0 — Freeze & back up (Developer, Day −2)

1. **Announce a change freeze.** No menu or code edits from now until handover is complete.
2. **Tag the current release** so there is a known-good restore point:
   ```bash
   git checkout main && git pull
   git tag -a v1.0-handover -m "State of site at ownership handover"
   git push origin v1.0-handover
   ```
3. **Download a full copy of the code:** GitHub → repo → **Code → Download ZIP**.
4. **Export the Firebase database:** Firebase Console → Realtime Database → **⋮ → Export JSON**.
5. **Copy the Firebase security rules:** Realtime Database → **Rules** tab → copy into
   `firebase-rules-backup.json`.
6. **List staff logins:** Firebase → Authentication → Users → note each email (not passwords).
7. **Export the DNS zone:** Cloudflare → `bbqheaven.au` → DNS → Records → **Import and Export →
   Export**. Also take a screenshot of the records page.
8. **Record current settings:** Cloudflare → **Workers & Pages → `bbqheaven` → Settings → Build**
   → screenshot the Git repository, build command, deploy command and the list of build
   variable *names*; also screenshot **Settings → Domains & Routes**.
9. Put all backups (ZIP, JSON, rules, DNS export, screenshots) in a folder and share it with the
   client via their storage (Google Drive / OneDrive). **Do not include secret keys** in this folder.

✅ **Verify:** backup folder contains 6 items; tag `v1.0-handover` is visible on GitHub → Tags.

---

## 4. Phase 1 — Code (GitHub) (Day 0)

**Recommended: GitHub repository transfer** (keeps all history, issues and redirects old links).

1. **Developer:** GitHub → `jericrealubit/bbqheaven` → **Settings → General → Danger Zone →
   Transfer ownership**.
2. Enter the client's GitHub username (or organisation name) and confirm.
3. **Client:** open the email from GitHub and **accept the transfer** (within 24 hours).
4. **Client:** in the repo → **Settings → Collaborators** — decide whether to keep the developer
   for the support period (recommended: keep as *Write* access, remove after support ends).
5. **Client:** **Settings → Branches** → add a branch protection rule for `main` (optional but
   recommended: require pull request for code changes by others).

*Alternative (if transfer is not possible):* client creates an empty private repo and developer
runs `git clone --mirror https://github.com/jericrealubit/bbqheaven.git && cd bbqheaven.git &&
git push --mirror https://github.com/<client>/bbqheaven.git`.

✅ **Verify:** repo appears at `https://github.com/<client>/bbqheaven`; commit history and the
`v1.0-handover` tag are present.

> Note: The existing Cloudflare Worker's Git connection points at the old repo location. The site keeps
> serving its last deployment, so nothing breaks — the new Cloudflare project in Phase 3 connects
> to the new repo.

---

## 5. Phase 2 — Database & backend (Day 0)

### 5a. Firebase (orders + staff logins) — keep the same project, change the owner

This is the zero-downtime method: the project ID and keys stay the same, so the website needs
no changes.

1. **Developer:** Firebase Console → ⚙️ **Project settings → Users and permissions → Add member**
   → client's Google email → role **Owner**.
2. **Client:** accept the invitation email and open the project.
3. **Client:** if the project is on the paid *Blaze* plan, go to **Usage and billing → Details &
   settings → Modify plan** and link the client's own billing account. (On the free *Spark*
   plan, skip this.)
4. **Client:** Authentication → **Settings → Authorized domains** — confirm `bbqheaven.au` and
   the new `bbqheaven.<subdomain>.workers.dev` domain are listed (add the workers.dev one after
   Phase 3).
5. **Client:** Authentication → Users — add an account for each staff member who should use the
   kitchen dashboard; remove any the developer created for testing.
6. **Client (after Phase 6 sign-off):** remove the developer from Users and permissions.

✅ **Verify:** client can see Realtime Database → `orders` and Authentication → Users.

*Alternative — new Firebase project in the client's account:* create project → add a Web app →
create Realtime Database (region `asia-southeast1` recommended for Perth) → **Import JSON** from
the backup → paste the backed-up **Rules** → enable **Email/Password** sign-in and re-create staff
users → use the new web-app config values for the `ADMIN_FIREBASE_*` variables in Phase 3.

### 5b. Supabase (live visitor counter)

Supabase only powers the "people viewing now" counter. There is no data to move.

1. **Client:** Supabase dashboard → **New project** (name `bbqheaven`, region *Sydney*
   `ap-southeast-2`, save the database password in the password manager).
2. **Client:** Project Settings → **API** → copy the **Project URL** and the **anon public** key
   into the password manager. These become `SUPABASE_URL` and `SUPABASE_KEY`.
   (Realtime is enabled by default — no tables needed.)

*Alternative:* developer invites the client to the existing Supabase **organisation** as Owner,
then leaves the organisation — values stay the same.

✅ **Verify:** both values saved in the vault.

---

## 6. Phase 3 — Hosting (Cloudflare Workers) (Day 0)

The site runs as a Cloudflare **Worker** (static assets) deployed by **Workers Builds**. Workers
can't be moved between Cloudflare accounts, so the client creates a fresh Worker connected to
their GitHub repo. The developer's Worker stays live until DNS is switched.

1. **Client:** Cloudflare dashboard → **Workers & Pages → Create → Import a repository**
   (Workers tab).
2. Authorise Cloudflare to access the client's GitHub and select the `bbqheaven` repo.
3. **Build settings:**
   - Project (Worker) name: `bbqheaven` — must match `"name"` in `wrangler.jsonc`
     (if you choose another name, change it in `wrangler.jsonc` too)
   - Production branch: `main`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Non-production branch builds: **enabled** (gives preview URLs for other branches)
4. **Build variables:** under *Advanced settings → Build variables* (or later in
   **Settings → Build → Variables and secrets**) add all 9 variables listed in section 1 —
   values come from Phase 2. Use the **Secret** type for the keys.
5. Click **Create and deploy** and wait for the build log to finish with ✅.
6. Open the Worker's preview address `https://bbqheaven.<client-subdomain>.workers.dev`
   (shown on the Worker's overview page) and run the **smoke test** in Phase 5 (all items except
   custom-domain ones). If the menu loads but orders fail, a build variable is missing — fix it
   and **Retry build**.
7. Add `bbqheaven.<client-subdomain>.workers.dev` to Firebase **Authorized domains**
   (Phase 2a step 4).

✅ **Verify:** the `workers.dev` site loads the menu, the live counter shows a number, and a test
order appears in the kitchen dashboard opened on the `workers.dev` address.

**Do not continue to Phase 4 until this works.**

---

## 7. Phase 4 — Domain (Hostmate) & DNS (Day 0 → Day +5)

There are **three separate things** for a `.au` domain — don't mix them up:

| Thing | Meaning | Where |
|-------|---------|-------|
| **Registrant** | The legal owner of the domain (must be an Australian entity, linked to an ABN) | auDA record, managed in Hostmate |
| **Registrar account** | Whose Hostmate login controls the domain and pays renewals | Hostmate |
| **DNS / nameservers** | Where the domain points (Cloudflare) | Set in Hostmate, records in Cloudflare |

### 7a. Prepare (Day −2)

1. **Developer:** lower the TTL of the main DNS records in Cloudflare to **5 minutes** (Auto) so
   changes propagate quickly.
2. **Developer:** Hostmate client area → Domains → `bbqheaven.au` → note expiry date, current
   nameservers and registrant details.

### 7b. Registrant (legal owner)

- **If the registrant is already the client's business/ABN:** nothing to do — go to 7c.
- **If the registrant is the developer:** request a **Change of Registrant** (sometimes called
  *Registrant Transfer*) in Hostmate (client area or Hostmate support). The client supplies the
  entity name, ABN and eligibility type and approves the request by email. auDA rules require
  the new registrant to meet `.au` eligibility (Australian presence).

### 7c. Hostmate account (who controls and pays) — Recommended: keep the domain at Hostmate

1. **Client:** create a Hostmate client-area account (pre-checklist).
2. **Developer:** contact Hostmate support (ticket from the client area) and request an
   **internal domain push / account change** of `bbqheaven.au` to the client's Hostmate
   account. Provide the client's account email/ID.
3. **Client:** approve the push if Hostmate asks, then in the domain settings:
   - [ ] Turn **Auto-renew ON** and add the business card.
   - [ ] Confirm **registrant contact** email is the business email (renewal notices go here).
   - [ ] Turn on **domain lock** (if offered) and **2FA** on the Hostmate account.

*Alternative — move to another registrar:* in Hostmate request the **domain password /
EPP (auth) code**, unlock the domain, then start a transfer at the new registrar using that code.
`.au` transfers usually complete within a few days and include a 1-year renewal fee. Only do
this if the client prefers another registrar; it adds risk and cost.

### 7d. DNS — move the zone to the client's Cloudflare account

1. **Client:** Cloudflare → **Add a domain** → `bbqheaven.au` → Free plan.
2. Cloudflare scans existing records. **Compare them with the DNS export from Phase 0** and add
   anything missing — especially any **MX / TXT (SPF, DKIM, verification)** records for email or
   Google.
3. Cloudflare shows **two nameservers** (e.g. `xxx.ns.cloudflare.com`). Copy them.
4. **Client (or developer with client):** Hostmate → `bbqheaven.au` → **Nameservers / Manage
   DNS** → replace the current nameservers with the client's two Cloudflare nameservers → Save.
5. Wait for Cloudflare to show the domain as **Active** (minutes to 24 hours; up to 48 hours).
6. **Client:** Workers & Pages → the new `bbqheaven` Worker → **Settings → Domains & Routes → Add
   → Custom domain** → add `bbqheaven.au`, then add `www.bbqheaven.au`. Cloudflare creates the DNS records and SSL
   certificate automatically.
7. **Client:** Rules → **Redirect Rules** → redirect `www.bbqheaven.au/*` →
   `https://bbqheaven.au/$1` (301) so there is one main address.
8. **Client:** SSL/TLS → set mode **Full (strict)**; Edge Certificates → **Always Use HTTPS: On**.

✅ **Verify:** `https://bbqheaven.au` and `https://www.bbqheaven.au` both load the site with a
padlock; https://dnschecker.org shows the new Cloudflare nameservers; email (if any) still works.

> Keep the developer's old Cloudflare Worker **running for 14 days** after the switch as a
> fallback. Only after Phase 6 sign-off should the developer remove the domain from their
> Cloudflare account and delete the old project.

---

## 8. Phase 5 — Cutover verification (smoke test) (Day 0 / Day +1)

Run on a phone **and** a computer. Tick every item.

**Customer site**
- [ ] Home page loads at `https://bbqheaven.au` with padlock (HTTPS)
- [ ] `www.bbqheaven.au` redirects to `bbqheaven.au`
- [ ] Menu loads; category buttons (Starters, Mains, BBQ Table, Kids, Drinks) work
- [ ] Gluten-free filter works; item photos display
- [ ] Items with sizes (e.g. Garlic Bread & Cheese) show options and correct prices
- [ ] Add to cart, refresh the page — cart is still there
- [ ] Cart total is correct
- [ ] Open/Closed status shows correctly for the current Perth time
- [ ] Live visitor counter shows a number (Supabase working)
- [ ] About, Location (map), Privacy, Terms pages load
- [ ] Phone link and social links work
- [ ] `https://bbqheaven.au/sitemap.xml` and `/robots.txt` load

**Ordering & kitchen**
- [ ] Place a **test order** (name it "TEST — please ignore")
- [ ] Log in at `https://bbqheaven.au/admin-dashboard.html` with a staff account
- [ ] Test order appears instantly; "Mark Ready" / "Undo Ready" works; delete the test order
- [ ] Sign out works

**Search & listings**
- [ ] Google Search Console: add the client as **Owner** (Settings → Users and permissions), or
      verify the domain in the client's own Search Console via a DNS TXT record; resubmit
      `sitemap.xml`
- [ ] Google Business Profile: client is Owner; website link is `https://bbqheaven.au`

---

## 9. Phase 6 — Credential rotation & access removal (Day +1 → end of support)

Once everything is verified, make sure **only the client** holds the keys.

1. **Client:** change the password of every account in section 2 and confirm 2FA is on.
2. **Client:** Firebase → change passwords of all staff dashboard logins (or ask staff to reset).
3. **Client:** remove the developer from:
   - [ ] GitHub collaborators (after the support period)
   - [ ] Firebase Users and permissions
   - [ ] Supabase organisation (if invited)
   - [ ] Cloudflare account members (if added)
   - [ ] Hostmate account / contacts
   - [ ] Google Search Console & Business Profile
4. **Developer:** delete the old Cloudflare Worker (Settings → Delete) and the old `bbqheaven.au` zone from
   their Cloudflare account; delete the old Supabase project (if a new one was made); delete local
   `.env` files and any copies of keys.
5. **Developer:** send written confirmation that all copies of credentials have been deleted.

✅ **Verify:** client checks each service's member/user list — only client accounts remain.

---

## 10. Rollback plan

If the site breaks after the switch:

| Problem | Rollback |
|---------|----------|
| New Cloudflare deployment broken | Worker → **Deployments** → previous working version → **⋯ → Rollback** |
| Domain not loading after nameserver change | In Hostmate, set nameservers back to the **old** values recorded in Phase 0/7a. The old Cloudflare project is still live and serves the site. |
| Orders not reaching the dashboard | Check the 9 build variables (Worker → Settings → Build), then **Retry build**. Check Firebase Authorized domains. |
| Missing email after DNS move | Re-add MX/TXT records from the Phase 0 DNS export |
| Code lost / bad change | Restore from tag `v1.0-handover` or the ZIP backup |

---

## 11. Timeline

| Day | Who | Task |
|-----|-----|------|
| −7 | Both | Agree date, review this plan, client starts pre-transfer checklist |
| −2 | Developer | Phase 0 backups, lower DNS TTL, confirm domain registrant/expiry |
| 0 (AM) | Both | Phase 1 GitHub transfer, Phase 2 Firebase/Supabase |
| 0 (PM) | Client + Dev | Phase 3 Cloudflare Worker, test on `workers.dev` |
| 0 (PM, after close) | Client + Dev | Phase 4 nameserver switch at Hostmate |
| +1 | Both | Phase 5 smoke test, Google Search Console |
| +1 → +5 | Developer/Hostmate | Hostmate account push / change of registrant completes |
| +7 | Client | Handover training session using the Owner Guide |
| +14 | Both | Phase 6 access removal, old project deleted, sign-off |

---

## 12. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Downtime during DNS switch | Low | Medium | Lowered TTL, switch while shop is closed, old project kept live |
| Missing environment variable → orders fail | Medium | High | Test full order flow on `workers.dev` before switching DNS |
| Email stops working | Low | High | Compare DNS records with Phase 0 export before switching nameservers |
| Domain expires during transfer | Low | High | Check expiry first; renew if within 30 days; turn on auto-renew |
| `.au` eligibility rejected | Low | High | Use the business ABN and exact legal name |
| Credentials leaked during handover | Low | High | Password manager sharing only; rotate all passwords in Phase 6 |
| Firebase/Supabase free-tier limits | Low | Medium | Client sets billing alerts (see Owner Guide) |

---

## 13. Post-handover support

- Support period: `<<e.g. 30 days>>` from sign-off, covering questions and fixes to issues caused
  by the transfer.
- Out of scope after that: new features, design changes (quoted separately).
- Contact: `<<DEVELOPER EMAIL / PHONE>>`

Client documentation provided:
- [`HANDOVER_OPTIONS.md`](./HANDOVER_OPTIONS.md) — the three handover options (this plan applies to Options 1 and 2)
- [`OWNER_GUIDE.md`](./OWNER_GUIDE.md) — how to run and maintain the website
- [`MENU_UPDATE_GUIDE.md`](./MENU_UPDATE_GUIDE.md) — how to change menu items and prices
- [`CREDENTIALS_HANDOVER_TEMPLATE.md`](./CREDENTIALS_HANDOVER_TEMPLATE.md) — email template for sending logins (fill in a copy, never commit real values)

---

## 14. Handover sign-off

| Item | Received by client | Date |
|------|--------------------|------|
| GitHub repository owned by client | ☐ | |
| Cloudflare Worker in client account, site live on bbqheaven.au | ☐ | |
| Firebase project owned by client, staff logins working | ☐ | |
| Supabase project owned by client | ☐ | |
| `bbqheaven.au` in client's Hostmate account, registrant = client, auto-renew on | ☐ | |
| DNS zone in client's Cloudflare account | ☐ | |
| Backups folder (code ZIP, database export, rules, DNS export) | ☐ | |
| Owner Guide and Menu Update Guide walkthrough completed | ☐ | |
| Developer access removed / credentials deleted | ☐ | |

**Developer:** ______________________  Signature: __________  Date: ________

**Client:** _________________________  Signature: __________  Date: ________
