# 📧 Newsletter SaaS Frontend

**Frontend Assignment – Multi-Tenant Newsletter Platform**

---

## 🚀 Overview

This repository contains the complete frontend implementation of a multi-tenant newsletter SaaS application. The UI is built with modern web technologies and communicates with a NestJS backend design. Because the backend was unstable during development, all server interactions are simulated using [MSW](https://mswjs.io/) while maintaining correct API contracts.

**Tech stack:**

- React (Vite)
- TypeScript
- Material UI
- Tailwind CSS 4.1
- React Query
- Zustand
- MSW (Mock Service Worker)

---

## 🏗 Architecture

The codebase follows a **feature-based modular structure**:

```
src/
 ├── app/
 │    ├── routes/
 │    ├── store/
 │    └── providers/
 │
 ├── components/
 │    ├── layout/
 │    ├── ui/
 │
 │
 ├── features/
 │    ├── auth/
 │    ├── dashboard/
 │    ├── organizations/
 │    ├── lists/
 │    ├── subscribers/
 │    ├── campaigns/
 │    ├── templates/
 │    └── automation/
 │
 ├── lib/
 │    ├── api/
 │    ├── mock/
 │    └── utils/
 │
 └── types/
```

### Key principles

- Feature isolation
- Multi-tenant security enforcement
- Role-based route control
- API abstraction layer
- Optimistic UI updates
- Centralized state management

---

## 🔐 Multi-Tenancy & Security

Security is applied on multiple layers to ensure proper isolation and access control.

### 1. Organization isolation

- Every request automatically includes an `x-org-id` header.
- The mock backend filters data by organization.

### 2. Role-Based Access Control (RBAC)

Supported roles: `Superadmin`, `Admin`, `User`

| Feature       | Superadmin | Admin | User |
| ------------- | :--------: | :---: | :--: |
| Dashboard     |     ✅     |  ✅   |  ✅  |
| Lists         |     ✅     |  ✅   |  ❌  |
| Subscribers   |     ✅     |  ✅   |  ❌  |
| Campaigns     |     ✅     |  ✅   |  ❌  |
| Templates     |     ✅     |  ✅   |  ❌  |
| Automation    |     ✅     |  ✅   |  ❌  |
| Organizations |     ✅     |  ❌   |  ❌  |

Security enforcement points:

- Route level (`RoleGuard`)
- UI level (sidebar filtering)
- API level (interceptors)

### 3. Protected API wrapper

Axios interceptors take care of:

- Attaching JWT token
- Attaching organization ID
- Handling 401 responses (logout)
- Centralized error handling

---

## 🧩 Features Implemented

### 🔑 Authentication

- Register & login
- Token-based sessions
- Zustand auth store
- Protected routes via guards

### 📊 Dashboard

- Organization-aware statistics
- Counts for campaigns, lists, subscribers
- Responsive KPI cards

### 🗂 List Management

- Create private lists
- Pagination & search
- Optimistic updates
- Organization isolation

### 👥 Subscriber Management

- Add subscribers manually or via CSV
- Custom fields (JSONB simulation)
- GPG key upload
- Segmentation logic & filtering
- Pagination

### ✉ Campaign Management

- Create campaigns with HTML content
- Select target lists
- Simulated sending
- Status tracking & click stats

### 📈 Click Analytics

- Per-link click tracking
- Engagement simulation
- Campaign statistics page

### 🎨 Template Editor (GrapeJS)

- Drag‑and‑drop editor
- Merge tags: `{{email}}`, `{{firstName}}`
- Save templates scoped to an organization
- Dynamically imported (Vite) with CDN CSS

### ⚙ Automation Engine

Trigger-based campaign automation:

- **Triggers:** subscriber added, campaign sent, RSS new item
- **Actions:** send campaign, create campaign from template
- RSS simulation engine included

### 🧪 Testing

- Vitest & React Testing Library
- MSW for API mocking
- Coverage for auth flow, list creation, role enforcement, route protection

### 🎨 UI System

- Material UI components + Tailwind CSS utilities
- Reusable components: `PageHeader`, `EmptyState`, `ErrorBoundary`
- Consistent spacing, responsive layouts, clean dashboard cards
- Role-aware sidebar rendering

---

## 🛠 Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Initialize MSW (one-time only)
npx msw init public/ --save

# 3. Start development server
npm run dev
# Open http://localhost:5173

# 4. Run tests
npm run test
```

---

## 🧠 Key Technical Decisions

**Why MSW?**

- Backend unstable during development
- Ensures predictable API behavior and reliable tests
- Enables full feature implementation independent of server

**Why feature-based structure?**

- Scalable and maintainable
- Clear separation of concerns
- Easier to test and extend

**Why React Query?**

- Server-state management with caching
- Automatic invalidation and optimistic updates
- Reduced boilerplate

**Why Zustand?**

- Lightweight auth store with minimal renders
- Simple and clean API

---

## ⚡ Enterprise Hardening

- Role-based access enforcement
- Optimistic UI updates
- Global error boundary
- Protected API layer
- 404 fallback pages
- Multi-layer security model

---

## 📌 Known Limitations

- GrapeJS loaded via CDN (acceptable for assignment)
- Backend data is mocked (no live database)
- RSS feed behavior is simulated

---
