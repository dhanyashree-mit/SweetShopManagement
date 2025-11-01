# Sweet Shop Management System

## Overview

A full-stack sweet shop e-commerce and inventory management application that allows customers to browse and purchase sweets while enabling administrators to manage product inventory. The system features role-based authentication, real-time inventory tracking, and a responsive design inspired by modern e-commerce platforms like Shopify and Etsy for the customer experience, and productivity tools like Linear and Notion for admin workflows.

**Key Features:**
- Customer-facing sweet catalog with search, filtering, and purchase capabilities
- Admin dashboard for inventory management (create, update, delete products)
- Role-based authentication (regular users and administrators)
- Real-time inventory tracking with low-stock alerts
- Responsive design with mobile-first approach
- Pre-seeded database with sample sweets

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **React Router** pattern implemented via manual page navigation state management (client-side routing without a formal router library)

**UI Component Strategy:**
- **Radix UI** primitives for accessible, unstyled components (dialogs, dropdowns, menus, etc.)
- **Shadcn UI** design system configured with "new-york" style variant
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Custom theming** supporting light/dark modes via CSS variables

**State Management:**
- **TanStack Query (React Query)** for server state management, caching, and synchronization
- **React Context** for authentication state (`AuthContext` with user, token, login/logout functions)
- Local component state via `useState` for UI-specific state

**Design System:**
- Typography: Playfair Display (serif headings) + Inter (sans-serif body)
- Responsive grid system with Tailwind breakpoints (md, lg, xl)
- Spacing primitives based on Tailwind's 8pt grid
- Custom color palette defined via HSL CSS variables for theme flexibility

### Backend Architecture

**Server Framework:**
- **Express.js** running on Node.js with ES modules
- TypeScript for type safety across the stack
- RESTful API design pattern

**Authentication & Authorization:**
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for password hashing (10 salt rounds)
- Token-based auth middleware (`authenticateToken`, `requireAdmin`)
- 7-day token expiration
- Role-based access control (RBAC) with `isAdmin` boolean flag

**Data Access Layer:**
- **Storage abstraction** via `IStorage` interface for testability and flexibility
- `SQLiteStorage` implementation using Drizzle ORM
- Repository pattern separating business logic from data access
- Transaction support for inventory operations (purchase, restock)

**API Design:**
- `/api/auth/*` - Authentication endpoints (register, login, me)
- `/api/sweets/*` - CRUD operations for sweets (admin-protected for modifications)
- `/api/sweets/:id/purchase` - Customer purchase endpoint with quantity validation
- `/api/sweets/:id/restock` - Admin restock endpoint
- `/api/sweets/search` - Advanced filtering (name, category, price range)

### Data Storage Solutions

**Database:**
- **SQLite** for local development with `better-sqlite3` driver
- **Drizzle ORM** for type-safe database queries and migrations
- **PostgreSQL** support configured via `@neondatabase/serverless` (Neon Database) for production deployments
- Migration system via `drizzle-kit` with migrations stored in `/migrations` folder

**Schema Design:**

**Users Table:**
- `id` (auto-increment primary key)
- `username` (unique, not null)
- `password` (hashed, not null)
- `isAdmin` (boolean, default false)

**Sweets Table:**
- `id` (auto-increment primary key)
- `name` (not null)
- `category` (not null)
- `price` (real/float, not null)
- `quantity` (integer, default 0)

**Data Seeding:**
- Automatic seeding on first run with 6 sample sweets
- Categories: Chocolate, Gummies, Lollipops, Caramels, Hard Candy

### Authentication and Authorization Mechanisms

**Registration Flow:**
1. User submits username, password, and optional `isAdmin` flag
2. System validates username uniqueness
3. Password hashed with bcrypt (10 rounds)
4. User record created in database
5. JWT token generated and returned with user data

**Login Flow:**
1. User submits credentials
2. System retrieves user by username
3. Password compared against hash
4. JWT token generated on success
5. Token stored in localStorage on client

**Protected Routes:**
- Middleware checks `Authorization: Bearer <token>` header
- Token verified and decoded to extract user data
- User object attached to request for downstream handlers
- Admin-only routes validate `isAdmin` flag

**Security Considerations:**
- Passwords never returned in API responses
- JWT secret configurable via environment variable
- Token expiration enforced (7 days)
- CORS and CSRF protection via Express middleware

### Testing Strategy

**Test Framework:**
- **Jest** with `ts-jest` for TypeScript support
- **Supertest** for API endpoint testing
- ESM module support configured

**Test Organization:**
- Tests located in `server/__tests__/`
- Organized by feature: `auth.test.ts`, `sweets.test.ts`, `inventory.test.ts`
- Database cleaned before each test for isolation

**Coverage:**
- Unit tests for authentication (register, login, token validation)
- Integration tests for sweet CRUD operations
- Inventory management tests (purchase, restock, stock validation)

## External Dependencies

### Third-Party Services

**Database Hosting:**
- **Neon Database** (PostgreSQL-compatible serverless database)
- Connection via `@neondatabase/serverless` package
- `DATABASE_URL` environment variable required for production

**Development Tools:**
- **Replit** integration via custom Vite plugins:
  - `@replit/vite-plugin-runtime-error-modal` for error overlays
  - `@replit/vite-plugin-cartographer` for code navigation
  - `@replit/vite-plugin-dev-banner` for development indicators

### Key NPM Packages

**Frontend:**
- `@tanstack/react-query` - Server state management
- `@radix-ui/*` - Accessible UI primitives (20+ component packages)
- `class-variance-authority` - Component variant management
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Icon library
- `react-hook-form` + `@hookform/resolvers` - Form management
- `zod` - Schema validation

**Backend:**
- `express` - Web server framework
- `drizzle-orm` - TypeScript ORM
- `better-sqlite3` - SQLite driver (local development)
- `@neondatabase/serverless` - PostgreSQL driver (production)
- `jsonwebtoken` - JWT creation and validation
- `bcryptjs` - Password hashing
- `drizzle-zod` - Zod schema generation from Drizzle tables

**Build & Development:**
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `tsx` - TypeScript execution for development
- `esbuild` - Server-side bundling for production

### Asset Management

**Static Assets:**
- Product images stored in `/attached_assets/generated_images/`
- Image mapping system (`imageMap`) links sweet names/categories to image files
- Fallback to default chocolate image for unknown products
- Images served via Vite's asset handling system