# E-Commerce Inventory & Stock Management Dashboard

A single-page React app for managing products and stock levels. It mixes a class component (`AuditLogger`) with functional components and Hooks.

**Live demo:** https://inventory-dashboard-amber.vercel.app

## Features

- Add products, adjust stock (+1, -1, +10), and delete products
- Stock badges: In Stock, Low Stock (5 or fewer), Out of Stock
- Search, category filter, and stock status filter
- Light and dark theme through React Context
- Audit log (class component) saved in `localStorage`, with toast notifications
- Inventory and theme persist across page reloads

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Project structure

```
src/
├── components/
│   ├── class/
│   │   └── AuditLogger.jsx
│   └── functional/
│       ├── CardWrapper.jsx
│       ├── Header.jsx
│       ├── InventoryMetrics.jsx
│       ├── ProductCard.jsx
│       ├── ProductForm.jsx
│       ├── ProductList.jsx
│       └── ThemeToggle.jsx
├── context/
│   └── ThemeContext.jsx
├── hooks/
│   └── useDebounce.js
├── utils/
│   └── stock.js
└── App.jsx
```

## Where each requirement is covered

| Topic | Where |
| --- | --- |
| Component-based architecture | `src/components`, `App.jsx` |
| Props, callback props, `props.children` | `ProductForm`, `ProductList`, `ProductCard`, `CardWrapper` |
| Class component and lifecycle methods | `AuditLogger.jsx` |
| Conditional rendering, `map()` with keys, events | `ProductList`, `ProductCard`, `ProductForm` |
| `useState` | `App.jsx`, `ProductForm.jsx` |
| `useEffect` | `App.jsx` (localStorage sync, document title), `ProductForm.jsx` |
| `useContext` | `ThemeToggle.jsx` with `ThemeContext.jsx` |
| `useRef` | `ProductForm.jsx` (focus on the title input) |
| `useMemo` / `useCallback` | `App.jsx`, with `memo` on `ProductCard` |

## CSR vs SSR

With client-side rendering, which is what this Vite + React project uses, the server sends an almost empty HTML file plus a JavaScript bundle. The browser downloads the bundle, runs React, and builds the page on the user's device. The first load is a little slower because nothing meaningful appears until the JavaScript has executed, but after that every click feels instant, since updates happen locally. The server only has to serve static files. With server-side rendering, as in Next.js, the server runs React for each request, generates finished HTML, and sends it to the browser. The user sees real content quickly, and then React hydrates the page to make it interactive. This needs a running Node server or serverless functions.

For an enterprise e-commerce application, the trade-offs are real. On performance, SSR gives a faster first contentful paint, especially on slow phones and weak networks, while CSR gives smoother interaction after loading and puts less work on the server. On SEO, search engines can run JavaScript, but SSR delivers ready-made HTML with titles and product data, so it is more reliable for public product pages that need to rank. On hosting, CSR is cheap and simple, because any static host or CDN such as Vercel, Netlify or GitHub Pages works. SSR costs more and adds server, caching and scaling work.

For this Inventory Dashboard I would stay with CSR. It would sit behind a login, so SEO does not matter, and the interface is highly interactive. For a public storefront, I would choose SSR so product pages load fast and get indexed properly.
