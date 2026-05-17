# Frontend → Backend API Integration Document

> **Scope note (important):** This document is generated **strictly** from the current frontend codebase HTTP calls and TypeScript data contracts. At this stage, the Angular app defines only two API service calls:
>
> - `GET /api/products`
> - `GET /api/categories`
>
> No frontend calls to `AuthService`, `CartService`, `OrderService`, or related endpoints were found in this repository version.

---

## 1) API Contract (Exact Frontend Usage)

### 1.1 Fetch Products

| Field | Details |
|---|---|
| Route Name | Fetch Products |
| Purpose | Load all products for listing/cards in the storefront UI. |
| Angular Caller | `ProductService.getProducts()` |
| HTTP Method | `GET` |
| Endpoint URL | `/api/products` |
| Headers Required | No custom headers required by frontend code. Standard `Accept: application/json` implied by Angular HttpClient. |
| URL Parameters | None |
| Query Variables | None |
| Request Body | None |

**Expected Response (JSON payload)**

```json
[
  {
    "id": 1,
    "name": "Organic Olive Oil",
    "price": 12.5,
    "imageUrl": "https://cdn.example.com/products/olive-oil.jpg",
    "categoryId": 2,
    "description": "Cold-pressed extra virgin olive oil"
  },
  {
    "id": 2,
    "name": "Whole Wheat Pasta",
    "price": 3.99,
    "imageUrl": "https://cdn.example.com/products/pasta.jpg",
    "categoryId": 1
  }
]
```

**TypeScript Contract Expected by Frontend**

- Response type: `Product[]`
- `Product` fields:
  - `id: number`
  - `name: string`
  - `price: number`
  - `imageUrl: string`
  - `categoryId: number`
  - `description?: string` (optional)

---

### 1.2 Fetch Categories

| Field | Details |
|---|---|
| Route Name | Fetch Categories |
| Purpose | Load product categories for filtering/labeling in product views. |
| Angular Caller | `CategoryService.getCategories()` |
| HTTP Method | `GET` |
| Endpoint URL | `/api/categories` |
| Headers Required | No custom headers required by frontend code. Standard `Accept: application/json` implied by Angular HttpClient. |
| URL Parameters | None |
| Query Variables | None |
| Request Body | None |

**Expected Response (JSON payload)**

```json
[
  {
    "id": 1,
    "name": "Pasta & Grains"
  },
  {
    "id": 2,
    "name": "Oils & Condiments"
  }
]
```

**TypeScript Contract Expected by Frontend**

- Response type: `Category[]`
- `Category` fields:
  - `id: number`
  - `name: string`

---

## 2) Canonical Frontend Data Models Used for Integration

### 2.1 `Product`

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  description?: string;
}
```

### 2.2 `Category`

```ts
interface Category {
  id: number;
  name: string;
}
```

---

## 3) Backend Implementation Notes (Derived from Frontend Expectations)

1. Return JSON arrays directly for both endpoints (`/api/products`, `/api/categories`), not wrapped envelopes.
2. Keep property names exactly camelCase as shown (`imageUrl`, `categoryId`).
3. Ensure numeric fields are true JSON numbers (`id`, `price`, `categoryId`).
4. `description` must be optional/nullable-safe on backend serialization.

---

# Part 2 — Frontend Architecture Document (PFE / Soutenance)

## 1. The Headless Architecture Strategy

The frontend was designed as a **headless client**: UI and interaction logic are fully decoupled from backend business logic and persistence concerns. The Angular application consumes HTTP APIs and treats the backend as an independent service boundary.

To preserve compatibility during the UI rewrite, the core business model contracts (`Product`, and the surrounding domain structure expected by the existing API layer) were kept stable. This enables a complete frontend modernization without forcing backend logic rewrites, minimizing integration risk and preserving existing .NET workflows.

## 2. The Technology Stack

- **Framework: Angular 18+**
  - Standalone component architecture.
  - Modern template control flow (`@for`, `@if`) for cleaner templates and improved rendering ergonomics.

- **Styling Engine: Tailwind CSS v3**
  - Utility-first design system implementation.
  - Mobile-first responsive strategy with composable classes.

- **Animation Engine: GSAP (GreenSock)**
  - High-performance animation timelines and direct DOM orchestration.
  - Better control for advanced choreography than basic CSS-only transitions.

## 3. The UI/UX “Alimentaire” Design System

- **Visual Language**
  - “Bento Box” grid composition for content grouping.
  - Glassmorphism-inspired surfaces (including blur/translucent layering patterns).
  - Generous whitespace and editorial spacing to elevate product readability.

- **Micro-interactions**
  - Interactive product-card motion patterns (e.g., tilt/hover depth effects).
  - Expressive cart CTAs such as progressive reveal/liquid-style interaction affordances.

- **Accessibility & Localization**
  - RTL-readiness strategy using logical spacing/alignment utilities (e.g., `start-*`, `rtl:` variants).
  - Theme adaptability with full Dark/Light mode behavior.

## 4. Performance Optimizations

- Adoption of modern Angular control flow avoids legacy structural directive overhead and reduces template boilerplate.
- UI architecture supports staggered/lazy loading patterns for heavier screens (for example admin-oriented dashboards), improving initial load experience and runtime responsiveness.

---

## Appendix — Endpoint Inventory Verification

Only the following HTTP calls are currently present in Angular source:

1. `GET /api/products`
2. `GET /api/categories`

If additional services (Auth/Cart/Order) are introduced later, this integration document should be extended by replaying the same extraction method directly from frontend service source.
