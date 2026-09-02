# Medex Pharmacy — E-Commerce Website

A full-stack pharmacy e-commerce site: Next.js 16 (App Router) + TypeScript + Tailwind CSS, MongoDB/Mongoose, NextAuth, Razorpay + UPI QR + COD payments, Cloudinary uploads, and a full admin dashboard.

Your logo and BharatPe UPI QR code are already wired in at `public/images/logo.jpg` and `public/images/payment-qr.jpg`, and your store details (address, phone, UPI ID, Kanpur delivery radius) are set in `lib/constants.ts`.

---

## 1. What's included

**Customer:** Home, Products (search/filter/sort), Product Details, Categories, Cart, multi-step Checkout (address → delivery → payment → confirmation), Login/Register (email + Google), Forgot Password, Account/Profile, My Orders + Order Tracking timeline, Prescription Upload + status tracking, Wishlist, About, Contact, FAQ, Privacy Policy, Terms.

**Admin (`/admin`):** Dashboard with sales charts & low-stock/prescription alerts, Product management (add/edit/deactivate), Category management, Order management with status updates, Prescription approval/rejection, Customer management, Coupon management, Delivery & store Settings (serviceable PIN codes, delivery charges, COD toggle).

**Payments:** Razorpay (UPI/cards/net banking/wallets), your UPI QR code (manual payment + WhatsApp confirmation), Cash on Delivery (conditional, as you specified).

**Backend:** MongoDB via Mongoose, NextAuth v5 (credentials + Google, JWT sessions, role-based access), Cloudinary for prescription/product image uploads, server-side stock & price re-validation on every order, SEO (sitemap.xml, robots.txt, product structured data).

---

## 2. Prerequisites

- Node.js 20+ and npm
- A MongoDB database (Atlas free tier is fine)
- A Razorpay account (test mode is free)
- A Cloudinary account (free tier is fine)
- A Google Cloud OAuth client (for Google login)

---

## 3. Installation

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see section 4), then:

```bash
npm run seed   # loads categories, ~32 demo products, admin user, a sample coupon
npm run dev    # http://localhost:3000
```

Admin login after seeding: **admin@medexpharmacy.local** / **ChangeMe123!** (change this immediately — see section 7).

---

## 4. Environment variables

All variables are documented in `.env.example`. Summary:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally; your live domain in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → APIs & Services → Credentials |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Cloudinary Console → Dashboard |
| `NEXT_PUBLIC_SITE_URL` | Your live domain (used for sitemap & metadata) |

### 4a. MongoDB Atlas setup
1. Create a free cluster at mongodb.com/cloud/atlas.
2. Database Access → add a user with a strong password.
3. Network Access → allow access from anywhere (`0.0.0.0/0`) or your host's IPs.
4. Connect → Drivers → copy the connection string into `MONGODB_URI`.

### 4b. Razorpay setup
1. Sign up at dashboard.razorpay.com, stay in **Test Mode** while developing.
2. Settings → API Keys → Generate Test Key → copy `Key ID` and `Key Secret`.
3. Switch to Live Mode keys only once you're ready to accept real payments (requires KYC).

### 4c. Cloudinary setup
1. Sign up at cloudinary.com.
2. Dashboard shows your Cloud Name, API Key, and API Secret directly — copy them in.

### 4d. Google login setup
1. console.cloud.google.com → APIs & Services → Credentials → Create OAuth client ID (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (add your production URL too, e.g. `https://yourdomain.com/api/auth/callback/google`).

---

## 5. Database seed

```bash
npm run seed
```

Seeds: 9 categories, ~32 demo products (across Pain Relief, Fever & Cold, Vitamins, Diabetes Care, Personal Care, Baby Care, First Aid, Skin Care, Digestive Health), one admin user, one sample coupon (`MEDICINE10`), and default store settings. Demo products are flagged `isDemo: true` and use a placeholder image — replace with real product photos and details from the admin panel before going live.

Re-running `npm run seed` is safe — it upserts, so it won't duplicate data.

---

## 6. Commands

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # run the production build
npm run seed    # seed the database
npm run lint    # lint
```

---

## 7. Before going live — a checklist

- [ ] Change the seeded admin password (log in, or update the user directly in MongoDB).
- [ ] Replace all demo products with real inventory, prices, and photos.
- [ ] Fill in your support `email` in `lib/constants.ts` (left blank — you didn't provide one).
- [ ] Move Razorpay from Test Mode to Live Mode keys.
- [ ] Set exact serviceable PIN codes in Admin → Settings (currently defaults to any PIN starting `208`).
- [ ] Replace the placeholder text in Privacy Policy and Terms & Conditions with content reviewed by a legal professional — this matters more than usual for a pharmacy, since regulations vary by state and you're handling prescription data.
- [ ] Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your real domain.
- [ ] Confirm your local pharmacy license / regulatory requirements for online medicine sales in Uttar Pradesh before launching.

---

## 8. Deployment

**Recommended: Vercel** (built by the Next.js team — zero-config for this stack).

1. Push this project to a GitHub repository.
2. Go to vercel.com → New Project → import the repo.
3. Add all variables from `.env.local` into Vercel's Environment Variables settings.
4. Deploy. Vercel gives you a free `*.vercel.app` URL immediately; add your custom domain under Project → Settings → Domains.
5. Every push to your main branch auto-deploys.

Vercel's free tier is enough to run this comfortably for a local pharmacy's traffic. If you outgrow it, upgrade to Pro (~$20/month).

**Alternative:** Railway or Render also work well if you'd rather have a single dashboard for both the app and a self-hosted MongoDB — but Atlas + Vercel is the simplest, most reliable combination for this project.

---

## 9. Project structure

```
app/                 Next.js App Router — pages & API routes
  admin/             Admin dashboard pages
  api/                REST API routes
components/          Reusable UI components
  admin/, home/, layout/, product/, ui/
lib/                 DB connection, auth config, constants, utilities, data-fetching
models/              Mongoose schemas
store/               Zustand client-side cart store
scripts/seed.js      Database seed script
public/images/       Your logo, payment QR, placeholder product image
```

---

## 10. Notes on what's stubbed vs. fully wired

- **Fully wired:** product catalog, search/filter/sort, cart, checkout (Razorpay + UPI QR + COD), auth (credentials + Google), order creation with server-side stock/price validation, prescription upload/approval workflow, admin dashboard/products/orders/prescriptions/customers/coupons/settings, delivery PIN-code check, coupons.
- **Stubbed with clear messaging (needs a provider you choose):** password-reset emails (`/forgot-password` — needs Resend/SendGrid), the contact form (`/contact` — currently shows a success toast only; wire it to an email API), and SMS/WhatsApp order notifications (Section 20 of the spec — needs Twilio/WhatsApp Business API or similar). These weren't stubbed as fake buttons; they're clearly marked in the code and UI for where to plug in a provider.
