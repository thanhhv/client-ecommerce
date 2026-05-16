# User-Facing Frontend Roadmap — Garden & Plant E-Commerce
**Stack:** Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS + TypeScript  
**Theme:** Nature-inspired — earthy greens, warm neutrals, clean organic feel  
**Goal:** Fast, lightweight, delightful UX for browsing plants, flowers, gardening tools & seeds

---

## Design System

### Color Palette
```css
/* Tailwind CSS variables in globals.css */
:root {
  --color-primary:       #3a6b35;   /* Deep forest green — CTAs, active states */
  --color-primary-light: #5a9e52;   /* Lighter green — hover states */
  --color-accent:        #e07b39;   /* Warm terracotta — badges, highlights */
  --color-surface:       #f9f6f0;   /* Warm off-white — page background */
  --color-card:          #ffffff;   /* Pure white — cards */
  --color-muted:         #8a8278;   /* Warm gray — secondary text */
  --color-border:        #e8e2d9;   /* Soft warm border */
  --color-text:          #2c2a27;   /* Near-black warm — body text */
}
```

### Typography
- **Display / Headings:** `Playfair Display` — elegant, botanical feel
- **Body / UI:** `DM Sans` — clean, modern, readable at small sizes
- Load via `next/font/google` — zero layout shift, self-hosted

### Design Principles
- **Organic, not clinical** — rounded corners, soft shadows, warm tones
- **Content-first** — product images are the hero, UI stays out of the way
- **Mobile-first** — most users browse on phone
- **Performance** — `next/image` for all product images, lazy loading, skeleton loaders
- **Whitespace** — generous padding, let products breathe

---

## Project Structure

```
user-app/
├── app/
│   ├── layout.tsx                  # Root: fonts, providers, header, footer
│   ├── globals.css                 # Tailwind + CSS variables
│   ├── page.tsx                    # Homepage
│   ├── products/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/
│   │       └── page.tsx            # Product detail
│   ├── cart/
│   │   └── page.tsx                # Cart page
│   ├── checkout/
│   │   └── page.tsx                # Checkout
│   ├── orders/
│   │   ├── page.tsx                # My orders list
│   │   └── [id]/page.tsx           # Order detail / tracking
│   ├── profile/
│   │   └── page.tsx                # User profile edit
│   └── auth/
│       ├── login/page.tsx
│       └── callback/page.tsx       # Google OAuth callback
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx              # Logo, nav, search, cart icon, user menu
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx           # Bottom nav bar on mobile
│   │   └── SearchBar.tsx           # Expandable search
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── PromoStrip.tsx          # "Free shipping over 500k" etc.
│   ├── products/
│   │   ├── ProductCard.tsx         # Used in grids
│   │   ├── ProductGrid.tsx         # Responsive grid wrapper
│   │   ├── ProductFilters.tsx      # Sidebar / drawer filters
│   │   ├── FilterChips.tsx         # Active filter pills
│   │   ├── SortSelect.tsx
│   │   ├── ProductImageGallery.tsx # Main image + thumbnails
│   │   ├── ProductInfo.tsx         # Name, price, brand, add to cart
│   │   ├── ProductDescription.tsx  # Rich description accordion
│   │   └── RelatedProducts.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx          # Slide-in mini cart from header
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentMethodSelect.tsx
│   │   └── OrderSummary.tsx
│   └── shared/
│       ├── PriceDisplay.tsx        # Handles base/sale price formatting
│       ├── StockBadge.tsx          # "In Stock" / "Only 3 left" / "Out of Stock"
│       ├── BreadCrumb.tsx
│       ├── Skeleton.tsx            # Loading skeletons
│       └── EmptyState.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts               # Axios instance
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── auth.ts
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useProductDetail.ts
│   │   ├── useCart.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── authStore.ts            # user, token
│   │   └── cartStore.ts            # local cart state + sync
│   ├── types/
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── common.ts
│   └── utils/
│       ├── formatCurrency.ts       # "1.200.000 ₫" format
│       ├── formatDate.ts
│       └── cn.ts
├── middleware.ts                   # Protect /cart, /checkout, /orders, /profile
└── .env.local
```

---

## Phase 0 — Project Setup & Design Foundation ✅ DONE

**Goal:** Running app with design system, fonts, layout shell, and shared utilities.

### Tasks
- [x] Init Next.js 14 with TypeScript + Tailwind + App Router
- [x] Init shadcn/ui, configure with custom theme colors
- [x] Setup `next/font/google` — Playfair Display + DM Sans
- [x] Define CSS variables in `globals.css`
- [x] Setup Axios instance with JWT interceptors
- [x] Setup TanStack Query provider
- [x] Setup Zustand stores: `authStore`, `cartStore`
- [x] Build `Header` component:
  - Logo (left), nav links (center, hidden on mobile), icons (right): search, cart badge, user
  - Cart icon shows item count badge — reads from `cartStore`
  - User menu dropdown: Login / My Profile / My Orders / Logout
- [x] Build `Footer` — logo, links, contact info, social icons
- [x] Build `MobileNav` — sticky bottom bar: Home | Browse | Cart | Account
- [x] Setup `proxy.ts` — redirect unauthenticated users away from protected routes
- [x] Build `formatCurrency` utility (Vietnamese đồng format)
- [x] Add `CartDrawer` — slide-in sheet when adding to cart or clicking cart icon

---

## Phase 1 — Authentication ✅ DONE

**Goal:** Login with Google, session restore, logout.

### Pages
- [x] `/auth/login` — "Sign in to continue" screen with Google button
- [x] `/auth/callback` — handles OAuth redirect, exchanges code for tokens, redirects to intended page

### UI
- [x] Login page: centered card with brand logo, tagline, Google sign-in button
- [x] Loading state while exchanging tokens
- [x] Error state if OAuth fails

### Logic
- [x] On callback: store `accessToken` in Zustand (memory), `refreshToken` set as httpOnly cookie by backend
- [x] On app load: if no `accessToken` → silently call refresh endpoint to restore session
- [x] Redirect back to original page after login (store `?redirect=` in URL)
- [x] Logout: clear store, call backend logout, redirect to home

---

## Phase 2 — Homepage ✅ DONE

**Goal:** Welcoming entry point that drives discovery.

### Page: `/`

### Sections (top to bottom)

**1. PromoStrip** — thin bar at top
- "🌿 Free shipping on orders over 500.000₫ | Fresh plants guaranteed"
- Dismissible, sticky

**2. HeroBanner**
- Full-width image with overlay text: headline + CTA button "Shop Now"
- Can be a simple static image (no carousel needed — faster)
- Seasonal/thematic: garden scene, lush greenery

**3. CategoryGrid**
- 4–6 category cards in a responsive grid
- Each: icon/image + category name (e.g., "🌸 Flowers", "🌿 Indoor Plants", "🧰 Tools", "🌱 Seeds")
- Tap → goes to `/products?category=<slug>`

**4. FeaturedProducts**
- "Best Sellers" — horizontal scroll on mobile, 4-column grid on desktop
- Uses `ProductCard` component

**5. Simple trust strip**
- 3–4 icons: "100% fresh", "Nationwide delivery", "Expert advice", "Easy returns"

### Performance notes
- Hero image: `next/image` with `priority` (preloaded)
- Featured products: fetched server-side (React Server Component) — no loading spinner
- Categories: static or revalidate every hour

---

## Phase 3 — Product Listing ✅ DONE

**Goal:** Browse all products with intuitive filtering and search.

### Page: `/products`

### URL-based filter state
Filters stored in URL search params — shareable links, back button works:
```
/products?category=indoor-plants&minPrice=50000&maxPrice=500000&sort=price-asc&q=monstera&page=2
```

### Layout
- **Desktop:** 2-column — filters sidebar (left, 280px) + product grid (right)
- **Mobile:** Full-width grid + "Filters" button opens a bottom drawer

### Filter Sidebar / Drawer
- **Search** (also in URL): text input, debounced 400ms
- **Category:** checkbox list (show all categories, multi-select)
- **Price Range:** dual-handle slider (min/max) + manual input fields
- **Availability:** "In Stock only" toggle
- **Sort:** Select — Newest / Price low→high / Price high→low / Name A-Z
- **Clear all filters** button (shown only when filters active)
- **FilterChips** — active filters shown as removable pills above grid

### ProductCard
- Product image (`next/image`, aspect-ratio 1:1, object-cover)
- Category label (small, muted)
- Product name (2-line clamp)
- Price: sale price (green, bold) + original price (strikethrough) if on sale
- `StockBadge` — "In Stock" / "Only 2 left!" / "Out of Stock"
- "Add to Cart" button (disabled if out of stock)
- Hover: slight lift shadow — CSS only, no JS

### ProductGrid
- Responsive: 2 cols mobile → 3 cols tablet → 4 cols desktop
- Loading state: skeleton cards (same dimensions as real cards)
- Empty state: "No products found" with illustration + "Clear filters" button

### Pagination
- Offset-based, simple Prev / Next + page numbers
- Scroll to top on page change

---

## Phase 4 — Product Detail ✅ DONE

**Goal:** Rich product page that builds trust and converts to purchase.

### Page: `/products/[slug]`

### Layout (desktop: 2-column, mobile: stacked)

**Left — ProductImageGallery**
- Large main image (swipeable on mobile)
- Thumbnail strip below (up to 6 images)
- Click thumbnail → swap main image
- Zoom on hover (desktop only, CSS transform)
- Lazy load non-primary images

**Right — ProductInfo**
- Breadcrumb: Home > Category > Product Name
- Brand name (small, muted, links to brand filter)
- Product name (H1, Playfair Display)
- `PriceDisplay`:
  - If on sale: `<sale price>` (large, green) + `<original>` (strikethrough) + "Save X%"
  - If not on sale: just the price
- `StockBadge`
- Short description (2–3 lines, plain text)
- Quantity selector (+ / - with min=1, max=stock)
- "Add to Cart" button (primary, full-width, disabled if out of stock)
- "Buy Now" button (secondary) — add to cart + redirect to checkout
- Trust icons: "🌿 Fresh guarantee", "🚚 Fast delivery", "↩️ Easy returns"

**Below the fold (full width)**
- `ProductDescription` — accordion tabs:
  - Description (rich text / markdown rendered)
  - Care instructions (for plants)
  - Shipping info
- `RelatedProducts` — "You might also like"
  - Same category, horizontally scrollable on mobile
  - 4 `ProductCard` components

### SEO
- `generateMetadata()` — dynamic title, description, OG image from product
- Structured data (JSON-LD) for product schema — helps Google Shopping

---

## Phase 5 — Cart & CartDrawer ✅ DONE

**Goal:** Frictionless cart management.

### CartDrawer (slide-in sheet, available on all pages)
- Triggered by: clicking cart icon OR adding item to cart
- List of cart items with image, name, quantity controls, price, remove button
- Subtotal
- "View Cart" button + "Checkout" button
- Empty state: "Your cart is empty" + "Browse products" link

### Cart Page (`/cart`)
- Full-page cart for review before checkout
- `CartItem` rows: image, name, unit price, quantity (+/-), line total, remove
- Order summary sidebar (sticky on desktop):
  - Subtotal
  - Shipping: "Calculated at checkout" or free if over threshold
  - Total
  - "Proceed to Checkout" button
- "Continue Shopping" link

### Cart State Strategy
- **Unauthenticated:** cart stored in `cartStore` (Zustand + `localStorage` via persist middleware)
- **Authenticated:** cart synced with backend (`GET/POST/PUT/DELETE /api/cart`)
- On login: merge local cart with server cart

---

## Phase 6 — Checkout & Order Placement ✅ DONE

**Goal:** Simple, fast checkout with minimal friction.

### Page: `/checkout` (protected — must be logged in)

### Single-page checkout (no multi-step wizard — simpler, faster)

**Section 1 — Delivery Information**
- Pre-filled from user profile if available
- Fields: Full name, Phone, Province/City, District, Ward, Street address
- "Save as default address" checkbox

**Section 2 — Payment Method**
- Radio cards:
  - 💵 Cash on Delivery (COD) — always available
  - 🏦 Bank Transfer — show bank account info after order placed
  - (Future: VNPay, MoMo — grayed out with "Coming soon")

**Section 3 — Order Notes**
- Optional textarea

**Right sidebar — Order Summary** (sticky)
- Items list (compact)
- Subtotal, shipping fee, total
- "Place Order" button

### Post-order
- Success page: order ID, summary, estimated delivery
- Email confirmation (backend sends)
- Cart cleared automatically

---

## Phase 7 — User Account ✅ DONE

**Goal:** Profile management + order history.

### Profile Page (`/profile`)
- Avatar (from Google, display only)
- Form: Full name, Phone, Address
- Save button with loading/success state

### Orders Page (`/orders`)
- List of all orders, newest first
- Each row: Order ID, date, total, status badge, "View Details" link
- Status badges: Pending (yellow) / Confirmed (blue) / Shipping (purple) / Delivered (green) / Cancelled (red)

### Order Detail Page (`/orders/[id]`)
- Status stepper: visual timeline
- Items ordered (image, name, qty, price)
- Shipping address
- Payment method
- Price breakdown
- Cancel button (only if PENDING)

---

## Performance Strategy

| Technique | Where applied |
|---|---|
| React Server Components | Homepage sections, product listing, product detail |
| `next/image` with lazy loading | All product images |
| `priority` image | Hero banner, first product in detail page |
| Skeleton loaders | Product grid, product detail |
| Debounced search input | Product listing (400ms) |
| URL-based filter state | Product listing (no extra state, shareable) |
| TanStack Query cache | Cart, user profile (client components) |
| CSS-only hover effects | ProductCard lift, image zoom |
| Static generation + ISR | Homepage, category pages (revalidate: 3600s) |
| Font subsetting | next/font auto-subsets Google Fonts |
| No heavy animation libraries | CSS transitions only, no Framer Motion |

---

## Recommended Dependencies

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "@tanstack/react-query": "^5.x",
  "zustand": "^4.x",
  "axios": "^1.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "sonner": "^1.x",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "@radix-ui/react-slider": "latest"
}
```

> No Framer Motion, no heavy carousel libraries — keep bundle lean.  
> Use native CSS scroll-snap for image gallery and horizontal product scrolls.

---

## Phase Summary

| Phase | Focus | Key Pages/Components |
|---|---|---|
| 0 | Setup, design system, Header, Footer, CartDrawer | Layout shell |
| 1 | Google OAuth login, session management | `/auth/login` |
| 2 | Homepage — hero, categories, featured products | `/` |
| 3 | Product listing — filters, search, grid | `/products` |
| 4 | Product detail — gallery, info, related products | `/products/[slug]` |
| 5 | Cart — drawer + full cart page | `/cart` |
| 6 | Checkout + order placement | `/checkout` |
| 7 | Profile + order history + order detail | `/profile`, `/orders` |

---

*This document is a context file for AI-assisted implementation. Build Phase 0 components (Header, Footer, design tokens) before any page-specific work — they are used everywhere.*