# BBQ Heaven — Credentials Handover (Email Template)

> ## ⚠️ Instructions for the developer — delete this box before sending
>
> 1. **Never fill in this file in the repository.** Copy the text from "Email starts here"
>    into your email app (or a private document) and fill it in there. Never commit real
>    usernames, passwords or keys to GitHub.
> 2. **Best practice:** don't send passwords in the same email as usernames. Choose one:
>    - **Recommended:** share each login from a password manager (Bitwarden Send, 1Password
>      share link) and write "sent via password manager" in the password field, **or**
>    - send this email **without passwords**, then give the passwords by SMS or phone call.
> 3. Treat every password you send as **temporary**. The owner changes it on first login
>    (Transfer Plan, Phase 6).
> 4. Remove any row that doesn't apply (e.g. social accounts you don't manage).
> 5. Merge the docs branch into `main` before sending so the documentation links work.

---

<!-- ===================== EMAIL STARTS HERE ===================== -->

**Subject:** BBQ Heaven website — your account logins and handover documents

Hi `<<CLIENT NAME>>`,

As part of handing over **https://bbqheaven.au**, here are the logins for every service the
website uses, plus links to your guides.

**Please do these 3 things as soon as you receive this email:**
1. Log in to each account below and **change the password**.
2. Turn on **two-factor authentication (2FA)** wherever it's offered.
3. Save the new details in a **password manager**, then **delete this email** (including from
   Deleted Items).

---

## 1. Account logins

### GitHub — website files (code, menu, photos)
| | |
|---|---|
| Login | https://github.com/login |
| Username / email | `<<USERNAME OR EMAIL>>` |
| Password | `<<PASSWORD>>` |
| 2FA / recovery codes | `<<HOW 2FA IS SET UP / WHERE RECOVERY CODES ARE>>` |
| Repository | `https://github.com/<<OWNER>>/bbqheaven` |

### Cloudflare — website hosting and DNS
| | |
|---|---|
| Login | https://dash.cloudflare.com/login |
| Email | `<<EMAIL>>` |
| Password | `<<PASSWORD>>` |
| 2FA / recovery codes | `<<2FA DETAILS>>` |
| Worker name | `<<WORKER NAME, e.g. bbqheaven>>` |

### Google account / Firebase — online orders and kitchen staff logins
| | |
|---|---|
| Login | https://console.firebase.google.com |
| Google account email | `<<EMAIL>>` |
| Password | `<<PASSWORD>>` |
| 2FA / recovery | `<<2FA DETAILS / RECOVERY PHONE OR EMAIL>>` |
| Firebase project ID | `<<PROJECT ID>>` |
| Plan | `<<Spark (free) / Blaze>>` |

### Supabase — "people viewing now" counter
| | |
|---|---|
| Login | https://supabase.com/dashboard/sign-in |
| Email / sign-in method | `<<EMAIL or "Sign in with GitHub">>` |
| Password | `<<PASSWORD>>` |
| Project name | `<<PROJECT NAME>>` |
| Database password | `<<DATABASE PASSWORD>>` |

### Hostmate — domain name `bbqheaven.au`
| | |
|---|---|
| Login | https://www.hostmate.com.au (Client Area) |
| Email / client ID | `<<EMAIL OR CLIENT ID>>` |
| Password | `<<PASSWORD>>` |
| Domain password / EPP code | `<<EPP CODE — only needed to move registrar>>` |
| Registrant (legal owner) | `<<BUSINESS NAME>>`, ABN `<<ABN>>` |
| Domain expiry date | `<<DD/MM/YYYY>>` |
| Auto-renew | `<<ON / OFF>>` |

### Kitchen dashboard — staff logins
Address: **https://bbqheaven.au/admin-dashboard.html**

| Staff member / role | Login email | Temporary password |
|---------------------|-------------|--------------------|
| `<<e.g. Kitchen tablet>>` | `<<EMAIL>>` | `<<PASSWORD>>` |
| `<<e.g. Manager>>` | `<<EMAIL>>` | `<<PASSWORD>>` |
| `<<NAME>>` | `<<EMAIL>>` | `<<PASSWORD>>` |

You can add or remove staff logins in Firebase → Authentication → Users (see Owner Guide, section 3).

### Google Business Profile & Search Console
| | |
|---|---|
| Google Business Profile | https://business.google.com — owner: `<<EMAIL>>` |
| Google Search Console | https://search.google.com/search-console — owner: `<<EMAIL>>` |
| Notes | `<<e.g. "You have been added as Owner — accept the invite email">>` |

### Social media (only if managed by the developer)
| Account | Link | Login | Password |
|---------|------|-------|----------|
| Facebook | https://www.facebook.com/bbqheavenmandurah/ | `<<LOGIN>>` | `<<PASSWORD>>` |
| Instagram | https://www.instagram.com/bbqheavenadmin/ | `<<LOGIN>>` | `<<PASSWORD>>` |
| TikTok | `<<LINK>>` | `<<LOGIN>>` | `<<PASSWORD>>` |
| YouTube | https://www.youtube.com/@bbqheavenrockingham | `<<LOGIN>>` | `<<PASSWORD>>` |

---

## 2. Website settings (keep secret)

These connect the website to Firebase and Supabase. They're already entered in
**Cloudflare → Workers & Pages → `<<WORKER NAME>>` → Settings → Build → Variables and secrets**. You only
need them if the website is ever rebuilt or moved. **Don't change or share them.**

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `<<VALUE>>` |
| `SUPABASE_KEY` | `<<VALUE>>` |
| `ADMIN_FIREBASE_API_KEY` | `<<VALUE>>` |
| `ADMIN_FIREBASE_AUTH_DOMAIN` | `<<VALUE>>` |
| `ADMIN_FIREBASE_DATABASE_URL` | `<<VALUE>>` |
| `ADMIN_FIREBASE_PROJECT_ID` | `<<VALUE>>` |
| `ADMIN_FIREBASE_STORAGE_BUCKET` | `<<VALUE>>` |
| `ADMIN_FIREBASE_MESSAGING_SENDER_ID` | `<<VALUE>>` |
| `ADMIN_FIREBASE_APP_ID` | `<<VALUE>>` |

---

## 3. Your guides

| Guide | What it covers | Link |
|-------|----------------|------|
| **Owner Guide** | Running the website: logins, kitchen dashboard, opening hours, contact details, domain renewal, backups, troubleshooting | https://github.com/jericrealubit/bbqheaven/blob/main/docs/OWNER_GUIDE.md |
| **Menu & Price Update Guide** | Changing menu items, prices and photos yourself, and undoing mistakes | https://github.com/jericrealubit/bbqheaven/blob/main/docs/MENU_UPDATE_GUIDE.md |
| **Website Transfer Plan** | The step-by-step handover checklist and sign-off | https://github.com/jericrealubit/bbqheaven/blob/main/docs/TRANSFER_PLAN.md |

*Once the repository has been transferred to your GitHub account, these links redirect
automatically. You'll also find the guides in the `docs` folder of your repository.*

---

## 4. Your security checklist

- [ ] Changed the password on GitHub, Cloudflare, Google/Firebase, Supabase and Hostmate
- [ ] Turned on 2FA on every account and stored the recovery codes somewhere safe
- [ ] Changed the kitchen dashboard staff passwords
- [ ] Saved everything in a password manager
- [ ] Confirmed domain auto-renew is ON in Hostmate
- [ ] Deleted this email (and emptied Deleted Items)
- [ ] Removed my (developer) access when the support period ends — `<<DATE>>`

If anything doesn't work, contact me during the support period (until `<<DATE>>`):
`<<DEVELOPER NAME>>` · `<<EMAIL>>` · `<<PHONE>>`

Kind regards,
`<<YOUR NAME>>`

<!-- ===================== EMAIL ENDS HERE ===================== -->
