<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Pioma E-Commerce Project

## Project Overview

**Pioma** is an Indonesian artisan handbag e-commerce platform built with:
- **Framework**: Next.js 16.2.9 (App Router)
- **UI Library**: shadcn/ui with Base UI components
- **Backend**: Supabase (Authentication + Database)
- **Styling**: Tailwind CSS 4 with CSS variables
- **Language**: TypeScript 5
- **State**: React Context + Custom Hooks

---

## Tech Stack Details

### Core Dependencies
```json
{
  "next": "16.2.9",
  "react": "19.2.4",
  "@supabase/supabase-js": "^2.108.2",
  "@supabase/ssr": "^0.12.0",
  "shadcn": "^4.11.0",
  "tailwindcss": "^4",
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^1.20.0",
  "sonner": "^2.0.7",
  "embla-carousel-react": "^8.6.0",
  "next-themes": "^0.4.6"
}
```

### Path Aliases (defined in tsconfig.json)
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/ui/*` → `./src/components/ui/*`
- `@/lib/*` → `./src/lib/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`
- `@/services/*` → `./src/services/*`
- `@/context/*` → `./src/context/*`
- `@/api/*` → `./src/api/*`
- `@/data/*` → `./src/data/*`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider, Toaster
│   ├── globals.css        # Global styles + Tailwind + CSS variables
│   └── page.tsx           # Homepage (to be created)
│
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx     # Using Base UI + CVA
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── carousel.tsx
│   │   ├── accordion.tsx
│   │   ├── checkbox.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   ├── spinner.tsx
│   │   ├── pagination.tsx
│   │   ├── sonner.tsx     # Toast notifications
│   │   ├── breadcrumb.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── filter.tsx     # Custom filter component
│   │   └── product-card.tsx # Custom product card component
│   │
│   └── base/              # Base layout components
│       ├── header.tsx     # Sticky header with scroll behavior
│       ├── footer.tsx     # Multi-column footer
│       ├── aside-layouts.tsx # LeftAsideLayout, RightAsideLayout
│       └── index.tsx      # Styled-components exports
│
├── context/
│   └── AuthProvider.tsx    # Supabase auth context
│
├── hooks/
│   ├── useAuth.ts          # Auth context hook
│   ├── useSignIn.ts        # Sign-in form logic
│   └── useSignUp.ts        # Sign-up form logic
│
├── services/
│   └── auth.service.ts     # Supabase auth operations
│
├── api/
│   └── client.ts           # Supabase client initialization
│
├── lib/
│   └── utils.ts            # cn() helper, formatPrice() for IDR currency
│
├── types/
│   ├── product.ts          # Product interface
│   └── productVariant.ts   # ProductVariant interface
│
└── data/
    └── products.ts         # Mock product data (9 Indonesian artisan bags)
```

---

## Design System

### Color Palette
- **Primary/Tertiary**: `#e2725b` (Terracotta - accent color)
- **Background**: `oklch(1 0 0)` (White)
- **Foreground**: `oklch(0.145 0 0)` (Near black)
- **Card**: `oklch(1 0 0)` (White)
- **Border**: `oklch(0.922 0 0)` (Light gray)

### Typography
- **Font Heading**: Playfair Display (serif) - `--font-playfair-display`
- **Font Body**: Inter (sans-serif) - `--font-inter`
- **Custom Colors**: `text-tertiary` maps to `#e2725b`

### CSS Variables (globals.css)
```css
:root {
  --color-tertiary: #e2725b;
  --font-headline: var(--font-playfair-display);
  --font-body: var(--font-inter);
  --radius: 0.625rem;
}
```

---

## NestJS Backend Integration

### Environment Variables Required
Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Auth Service (src/services/auth.service.ts)
```typescript
authService.signIn(email, password)
authService.signUp(email, password, phone)
authService.signInWithOAuth(provider: "google" | "apple")
authService.signOut()
authService.getMe()
```

### Auth Provider Pattern
- Wraps app in `AuthProvider` (client component)
- Calls `authService.getMe()` on mount to read the session from the backend's httpOnly JWT cookie
- Exposes `user`, `profile`, `loading`, and `refresh()` via React Context

See [NESTJS_INTEGRATION.md](NESTJS_INTEGRATION.md) for the full endpoint list and setup guide.

---

## Component Conventions

### shadcn/ui Components
- Using **Base UI** as base (`@base-ui/react`)
- Using **CVA** (class-variance-authority) for variant styles
- Components are client components where interactivity needed
- Icons from **lucide-react**

### Button Variants (CVA)
```typescript
variant: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
size: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
```

### Custom Product Card
Located at `src/components/ui/product-card.tsx`:
- Displays product image, name, description, price
- Shows badge (e.g., "LIMITED", "BESTSELLER")
- Quick add to cart / wishlist buttons
- Hover scale effect on image

### Layout Components
- `LeftAsideLayout`: 1/4 sidebar + 3/4 content
- `RightAsideLayout`: Main content + fixed-width aside

---

## Existing Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;           // IDR currency
  image: string;           // Unsplash URL
  badge?: string;          // "LIMITED" | "BESTSELLER"
  category: string;        // "tote" | "crossbody" | "shoulder" | "backpacks" | "clutches"
  material?: string[];     // "leather" | "rattan" | "canvas" | "batik"
  variants?: ProductVariant[];
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  colorHex: string;
  images: [string, string, string];
}
```

### Currency Formatting
```typescript
formatPrice(price: number) // Returns "Rp 3.450.000" format for IDR
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Key Implementation Notes

### Next.js 16 Notes
- React Compiler is enabled (`reactCompiler: true` in next.config.ts)
- App Router is used (not Pages Router)
- Server Components by default, add `"use client"` for client components

### Image Configuration
Next.js images configured for Unsplash:
```typescript
images: {
  remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }]
}
```

### Toast Notifications
Using `sonner` with `richColors` and `position="top-right"`

### Dark Mode
`next-themes` is installed but theme provider not yet implemented

---

## E-Commerce Pages to Build

Priority order:
1. **Homepage** (`/`) - Hero, featured products, categories
2. **Shop** (`/shop`) - Product listing with filters
3. **Product Detail** (`/product/[id]`) - Full product view with variants
4. **Cart** (`/cart`) - Shopping cart
5. **Wishlist** (`/wishlist`) - Saved items
6. **Profile** (`/profile`) - User account
7. **Auth Pages** (`/signin`, `/signup`) - Authentication
8. **Checkout** (`/checkout`) - Payment flow
9. **About/Craftsmanship** (`/about`, `/craftsmanship`) - Static pages

---

## Development Guidelines

1. **Always run lint** after making changes: `npm run lint`
2. **Use TypeScript** - no `any` types without justification
3. **Follow existing patterns** - match code style in existing files
4. **Use shadcn components** - don't recreate UI primitives
5. **Mobile-first responsive** - use Tailwind responsive prefixes
6. **Format price with `formatPrice()`** - always use IDR formatting
7. **Use Lucide icons** - consistent iconography throughout
