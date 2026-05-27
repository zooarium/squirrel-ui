# Squirrel-UI AI Agent Context

This document provides context and guidelines for AI agents working on the Squirrel-UI codebase.

## 🎯 Project Overview

Squirrel-UI is a React-based **Personal Expense Tracker**. Users manage transactions (income/expense), categorize them, and view financial summaries via charts. Currency is **INR** (`en-IN` locale).

## 🛠️ Tech Stack

| Layer | Library |
|-------|---------|
| UI framework | React 19 (functional components + hooks) |
| CSS | **Tabler CSS 1.2** (Bootstrap-based — use Bootstrap utility classes) |
| Icons | `@tabler/icons-react` |
| Dialogs | `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog` |
| Charts | Recharts |
| Routing | React Router DOM v7 |
| Build | Vite 7 |
| Testing | Vitest + Testing Library |

> **No Tailwind.** Use Tabler/Bootstrap utility classes (`d-flex`, `gap-2`, `text-secondary`, `min-vh-100`, etc.).

## 📁 Source Structure

```
src/
  api/           auth.js · categories.js · transactions.js
  components/    AppLayout.jsx · Notification.jsx
  context/       NotificationContext.jsx · ThemeContext.jsx
  hooks/         useCategories.js · useTransactions.js
  infra/
    auth/        guards.jsx · storage.js
    http/        client.js · errors.js
    router/      index.jsx
    config.js
  pages/         LoginPage.jsx · DashboardPage.jsx · CategoriesPage.jsx
  ui/            barrel — import everything from here (see below)
```

## 🧩 UI Barrel (`src/ui/`)

**Always import from `../ui`, never from individual files.**

```js
import {
  Button, Card, CardHeader, CardTitle, CardBody,
  Badge, Spinner, FormField, Input, Select,
  Alert, Modal, ConfirmDialog,
  IconPlus, IconEdit, IconTrash, /* …other Tabler icons */
  CHART_COLORS, TRANSACTION_COLORS,
} from '../ui';
```

Swapping the underlying library only requires changes inside `src/ui/` — zero app-code changes.

## 🗺️ Routes

| Path | Page | Guard |
|------|------|-------|
| `/login` | `LoginPage` | public |
| `/dashboard` | `DashboardPage` | `PrivateRoute` |
| `/categories` | `CategoriesPage` | `PrivateRoute` |
| `/` | redirect → `/dashboard` or `/login` | — |

## 🌐 HTTP Layer

`src/infra/http/client.js` — thin `fetch` wrapper.
- `apiRequest(path, opts)` — authenticated API calls (attaches Bearer token).
- `authRequest(path, opts)` — auth-service calls (login).
- Auto-redirects to `/login` on 401.
- To swap `fetch` → `axios`: edit `client.js` only.

## 🎨 Theme

Light/dark toggle via `ThemeContext`. `data-bs-theme` attribute on `<html>` drives Tabler's theme. Standard Tabler defaults — no custom Matrix/cyberpunk styling.

## 📝 Coding Standards

- **Naming**: PascalCase for components, camelCase for variables/functions.
- **Formatting**: `npm run format` (Prettier) and `npm run lint` (ESLint) before committing.
- **Modals**: toggle `document.body.style.overflow` (`hidden`/`auto`) when opening/closing if background scroll bleeds through.
- **Forms**: client-side validation before API call; show field-level errors via `FormField error={…}` prop.
- **Notifications**: use `useNotification()` → `showNotification(message, 'success'|'error')`.

## 🚀 Common Tasks

### Add a new page
1. Create `src/pages/NewPage.jsx`, wrap with `<AppLayout>`.
2. Lazy-import in `src/infra/router/index.jsx`.
3. Add `<Route>` (wrap in `<PrivateRoute>` if auth-required).
4. Add nav link in `AppLayout.jsx` `NAV_ITEMS` array.

### Add a new API module
Create `src/api/thing.js` using `apiRequest` from `src/infra/http/client.js`. Mirror the pattern in `categories.js` or `transactions.js`.

### Add a new UI primitive
Add file inside `src/ui/`, export from `src/ui/index.js`. Never import UI primitives directly from their file path outside `src/ui/`.
