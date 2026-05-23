# 🌿 Thế Giới Cây Xanh — Customer Storefront

The customer-facing Next.js application for the Thế Giới Cây Xanh plant e-commerce platform. Browse plants, flowers, seeds, and gardening tools; manage a cart; and place orders.

**Dev URL:** `http://localhost:3000`  
**Requires:** Backend API running at `http://localhost:3001`

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Pages](#pages)
- [Key Patterns](#key-patterns)
- [Scripts](#scripts)

---

## Features

- **Authentication** — Google OAuth 2.0 and email/password login; silent session restore on page load via httpOnly refresh-token cookie
- **Product Catalog** — Browse with real-time filters (category, price range, in-stock toggle, keyword search); URL-based filter state for shareable links and working back button
- **Product Detail** — Swipeable image gallery, stock badge, related products, care instructions accordion
- **Shopping Cart** — Persistent across sessions (localStorage for guests, server-synced when logged in); slide-in drawer accessible from any page
- **Checkout** — Single-page checkout with delivery address, COD and bank-transfer payment options, order notes
- **Order Tracking** — Order list and per-order status stepper (Pending → Confirmed → Shipping → Delivered)
- **User Profile** — Edit full name, phone number, and shipping address
- **Responsive** — Mobile-first layout; sticky bottom navigation bar on mobile

---

## Tech Stack

| Concern | Library | Version |
|---------|---------|---------|
| Framework | Next.js (App Router) | ^16.2 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| UI Components | shadcn/ui + Radix UI | latest |
| Icons | Lucide React | ^1.16 |
| Server State | TanStack Query | ^5.100 |
| Client State | Zustand | ^5.0 |
| HTTP Client | Axios | ^1.16 |
| Toasts | Sonner | ^2.0 |
| Fonts | Be Vietnam Pro + Lora (next/font) | — |

---

## Project Structure

```
client/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout — fonts, providers, Header, Footer
│   ├── globals.css                 # Tailwind base + CSS custom properties
│   ├── page.tsx                    # Homepage (RSC — server-fetched)
│   ├── auth/
│   │   ├── login/page.tsx          # Login page (Google OAuth + email/password)
│   │   ├── register/page.tsx       # Registration page
│   │   └── callback/page.tsx       # OAuth callback handler
│   ├── products/
│   │   ├── page.tsx                # Product listing with filters
│   │   └── [slug]/page.tsx         # Product detail page
│   ├── cart/page.tsx               # Full cart review page
│   ├── checkout/page.tsx           # Checkout (protected)
│   ├── orders/
│   │   ├── page.tsx                # My orders list (protected)
│   │   └── [id]/page.tsx           # Order detail (protected)
│   └── profile/page.tsx            # User profile editor (protected)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Logo, nav, cart icon with badge, user dropdown
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx           # Sticky bottom bar (mobile only)
│   ├── home/
│   │   ├── HeroBanner.tsx          # Dark editorial hero section
│   │   ├── CategoryGrid.tsx        # Category pill chips (server component)
│   │   ├── FeaturedProducts.tsx    # Best-sellers grid (server component)
│   │   └── PromoStrip.tsx          # Free-shipping announcement bar
│   ├── products/
│   │   ├── ProductCard.tsx         # Card used in all product grids
│   │   ├── ProductGrid.tsx         # Responsive grid wrapper with skeleton
│   │   ├── ProductFilters.tsx      # Sidebar / drawer filters
│   │   ├── ProductImageGallery.tsx # Main image + thumbnail strip
│   │   └── ProductInfo.tsx         # Name, price, stock, add-to-cart
│   ├── cart/
│   │   ├── CartDrawer.tsx          # Slide-in sheet (available on all pages)
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentMethodSelect.tsx
│   │   └── OrderSummary.tsx
│   └── shared/
│       ├── PriceDisplay.tsx        # Base price / sale price formatting
│       ├── StockBadge.tsx          # "In Stock" / "Only N left" / "Out of Stock"
│       └── EmptyState.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts               # Axios instance with JWT interceptors + token refresh
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── hooks/
│   │   ├── useProducts.ts          # TanStack Query — paginated product list
│   │   ├── useProductDetail.ts
│   │   ├── useCart.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── authStore.ts            # Zustand — user + accessToken (memory)
│   │   └── cartStore.ts            # Zustand + localStorage persist — cart items
│   ├── types/
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── common.ts
│   └── utils/
│       ├── formatCurrency.ts       # "1.200.000 ₫" VND formatter
│       ├── formatDate.ts
│       └── cn.ts
│
├── proxy.ts                        # Next.js 16 middleware — protects /cart, /checkout, /orders, /profile
├── next.config.ts
└── .env.local
```

---

## Setup

### Prerequisites

- Node.js 18+
- Backend API running (`cd ../be && npm run dev`)

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment variables

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | — | Homepage — hero, categories, featured products, trust strip |
| `/products` | — | Product listing with filters and search |
| `/products/:slug` | — | Product detail — gallery, info, related products |
| `/auth/login` | — | Login (Google OAuth + email/password) |
| `/auth/register` | — | Register with email and password |
| `/auth/callback` | — | Google OAuth callback handler |
| `/cart` | Protected | Cart review before checkout |
| `/checkout` | Protected | Single-page checkout |
| `/orders` | Protected | Order history |
| `/orders/:id` | Protected | Order detail and status tracking |
| `/profile` | Protected | Edit profile (name, phone, address) |

Protected routes redirect to `/auth/login?redirect=<path>` if the user has no session.

---

## Key Patterns

### Authentication flow

- On login: access token stored in Zustand (memory only), refresh token set as `httpOnly` cookie by the backend.
- On app load: `useSessionRestore` silently calls `POST /auth/refresh` to restore the session from the cookie.
- On 401: the Axios interceptor automatically attempts a refresh and retries the original request. If the refresh fails, it redirects to `/auth/login`.

### Cart state

- **Guest:** cart lives in Zustand with `localStorage` persistence.
- **Logged in:** cart is synced with the backend. On login, local items are merged into the server cart via `CartSyncer`.

### Server vs. client components

- Homepage sections and product listing pages are **React Server Components** — data is fetched at the server with `revalidate` for ISR.
- Interactive components (cart, filters, auth) are `"use client"` and use TanStack Query or Zustand.

### URL-based filter state

All product filters (category, price, search, sort, page) live in URL search params. Filters are shareable, bookmarkable, and the back button works correctly.

---

## Scripts

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # ESLint check
```
