# Sweet Shop Management System - Design Guidelines

## Design Approach

**Hybrid Reference-Based Approach**: Drawing inspiration from modern e-commerce platforms (Shopify, Etsy) for the customer-facing sweet catalog, and productivity tools (Linear, Notion) for the admin dashboard. This creates a delightful shopping experience while maintaining efficiency for inventory management.

**Core Design Principles**:
- Delightful & Appetizing: Visual hierarchy that makes sweets irresistible
- Trust & Security: Clear authentication states and admin boundaries
- Efficient Management: Streamlined admin workflows for inventory control
- Responsive Flexibility: Seamless experience across all device sizes

---

## Typography System

**Font Families**:
- **Primary (Headings)**: 'Playfair Display' or 'Crimson Pro' - elegant serif that evokes classic candy shop charm
- **Secondary (Body)**: 'Inter' or 'DM Sans' - clean, highly legible sans-serif for UI and content
- **Accent (Special CTAs)**: Same as primary for consistency

**Type Scale**:
- Hero Heading: text-6xl md:text-7xl lg:text-8xl, font-bold
- Page Titles: text-4xl md:text-5xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Large: text-lg, font-normal
- Body Regular: text-base, font-normal
- Body Small: text-sm, font-normal
- Captions/Labels: text-xs md:text-sm, font-medium, uppercase tracking-wide

**Line Heights**:
- Headings: leading-tight (1.25)
- Body text: leading-relaxed (1.625)
- UI elements: leading-normal (1.5)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Micro spacing (gaps, padding): 2, 4, 6
- Component spacing: 8, 12, 16
- Section spacing: 20, 24, 32

**Grid System**:
- Container: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Product Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
- Admin Dashboard: grid grid-cols-1 lg:grid-cols-12 gap-6

**Breakpoints**:
- Mobile: < 768px (single column layouts)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (3-4 column grids, side-by-side layouts)

---

## Page-Specific Layouts

### Landing/Login Page
**Structure**: Split-screen on desktop (left: branding/imagery, right: form), stacked on mobile
- Hero section with appetizing sweet shop imagery (full-bleed background image)
- Centered login card with glass-morphism effect (backdrop-blur-lg, subtle transparency)
- Dimensions: w-full max-w-md mx-auto, p-8 md:p-12
- Quick toggle to registration form below
- Trust indicators: "Join 500+ sweet lovers" with small icon badges

### Registration Page
**Structure**: Similar to login but with multi-step feel
- Same split-screen approach
- Form fields in vertical stack with generous spacing (space-y-6)
- Progressive disclosure: basic info → preferences (admin checkbox)
- Visual feedback for password strength

### Sweet Catalog (Main Shop)
**Structure**: Multi-column masonry-style product grid
- Sticky header: Logo left, search bar center, user menu/cart right (h-16 md:h-20)
- Filter sidebar on desktop (w-64, sticky), collapsible drawer on mobile
- Product cards in responsive grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
- Each card: Image (aspect-square), title, category badge, price (large), quantity indicator, purchase button
- Empty states with delightful illustrations when no sweets match filters

### Individual Sweet Detail (Modal or Page)
**Structure**: Large product showcase
- Hero image section: 60% width on desktop, full-width on mobile
- Details panel: 40% width, sticky on scroll
- Includes: Name (text-4xl), category tag, price (text-3xl, prominent), detailed description, quantity stock indicator (visual progress bar), purchase section with quantity selector

### Admin Dashboard
**Structure**: Sidebar navigation + content area
- Left sidebar: w-64, fixed, navigation menu with icons
- Main content: flex-1, grid-based widgets
- Top bar: breadcrumbs, quick actions (Add New Sweet button - prominent)
- Dashboard widgets: 
  - Stats cards in 4-column grid (Total Sweets, Low Stock Alerts, Recent Purchases, Revenue)
  - Inventory table with inline editing capabilities
  - Quick action cards for common tasks

### Admin Sweet Management
**Structure**: Data table with action buttons
- Table header: sticky, with sortable columns
- Row actions: Edit (icon button), Delete (icon button with confirmation modal)
- Bulk actions toolbar appears when items selected
- Add/Edit Sweet form: Modal overlay with multi-step sections (Basic Info → Pricing → Inventory)

---

## Component Library

### Cards (Sweet Product Cards)
- Container: rounded-xl overflow-hidden, shadow-md, hover:shadow-xl transition
- Image: aspect-square object-cover, w-full
- Content padding: p-6
- Badge positioning: absolute top-4 right-4 for category tags
- Stock indicator: Bottom badge or progress bar (h-1.5 w-full rounded-full)

### Buttons
**Primary CTA** (Purchase, Save):
- Dimensions: px-6 py-3 md:px-8 md:py-4
- Typography: text-base md:text-lg font-semibold
- Shape: rounded-lg md:rounded-xl
- Full width on mobile: w-full md:w-auto

**Secondary** (Cancel, Back):
- Same dimensions, different visual treatment
- Border variant with transparent background

**Icon Buttons** (Edit, Delete):
- Size: w-10 h-10 md:w-12 h-12
- Rounded: rounded-lg
- Icon size: w-5 h-5

**Disabled State**: 
- Opacity: opacity-50, cursor-not-allowed

### Forms
**Input Fields**:
- Height: h-12 md:h-14
- Padding: px-4
- Border radius: rounded-lg
- Typography: text-base
- Label spacing: mb-2
- Error message: mt-1 text-sm

**Form Groups**:
- Vertical spacing: space-y-6
- Label above input pattern
- Helper text below in muted treatment

### Navigation
**Main Header**:
- Height: h-16 md:h-20
- Sticky positioning: sticky top-0 z-50
- Logo: h-8 md:h-10
- Nav links: text-base, spacing gap-6 md:gap-8

**Admin Sidebar**:
- Width: w-64, fixed height
- Item padding: px-4 py-3
- Icon + Text pattern, gap-3
- Active state: highlight with subtle background

### Modals & Overlays
**Modal Container**:
- Max width: max-w-2xl (forms), max-w-6xl (product details)
- Padding: p-6 md:p-8
- Border radius: rounded-2xl
- Backdrop: backdrop-blur-sm

### Data Display
**Tables** (Admin Inventory):
- Header: sticky top-0, font-semibold, text-sm uppercase tracking-wide
- Row height: h-16 md:h-20
- Cell padding: px-6 py-4
- Alternating row pattern for readability
- Hover state on rows

**Stat Cards** (Dashboard):
- Padding: p-6 md:p-8
- Border radius: rounded-xl
- Icon size: w-8 h-8 md:w-12 h-12
- Value typography: text-3xl md:text-4xl font-bold
- Label: text-sm uppercase tracking-wide

### Badges & Tags
**Category Badges**:
- Padding: px-3 py-1
- Border radius: rounded-full
- Typography: text-xs md:text-sm font-medium uppercase tracking-wide

**Stock Status**:
- In Stock: subtle positive treatment
- Low Stock: warning treatment
- Out of Stock: muted treatment

### Search & Filters
**Search Bar**:
- Width: w-full md:w-96 (header), w-full (dedicated search page)
- Height: h-12 md:h-14
- Icon: positioned absolute left-4
- Input padding: pl-12 pr-4

**Filter Panel**:
- Section spacing: space-y-6
- Checkbox/Radio groups: space-y-3
- Price range slider: custom component with dual handles

---

## Images

**Hero Image (Landing Page)**:
- Full-width background image of colorful assorted sweets/candy shop interior
- Overlay: gradient overlay for text legibility
- Placement: Behind login card on right side of split-screen
- Mobile: Visible in header area above login form

**Product Images (Sweet Cards)**:
- High-quality, well-lit photos of individual sweets
- Aspect ratio: 1:1 (square)
- Placement: Top of each product card
- Hover: Subtle zoom effect (scale-105)

**Empty State Illustrations**:
- Whimsical candy/sweet-themed illustrations
- Placement: Center of catalog when no results
- Size: max-w-sm mx-auto

**Dashboard Illustrations** (Optional):
- Small accent illustrations for empty dashboard states
- Placement: Within stat cards when no data available

---

## Accessibility & Polish

**Focus States**: 
- Visible focus rings: ring-2 ring-offset-2
- Keyboard navigation support throughout

**Loading States**:
- Skeleton screens for product cards during load
- Spinner for form submissions
- Shimmer effect: animate-pulse

**Error States**:
- Inline validation messages
- Error summary at form top
- Clear error iconography

**Responsive Behavior**:
- Mobile-first approach
- Touch-friendly targets (min 44px)
- Collapsible navigation on mobile
- Drawer patterns for filters/menus

**Micro-interactions**:
- Button hover states: subtle scale (scale-105) or shadow increase
- Card hover: lift effect with shadow
- Form input focus: border highlight
- Success animations: checkmark fade-in after purchase

---

## Animation Guidelines

**Use Sparingly - Only Where Meaningful**:
- Page transitions: Simple fade-in (opacity, duration-300)
- Modal enter/exit: Scale + fade (scale-95 to scale-100)
- Product card hover: Shadow and subtle lift (transition-all duration-200)
- Button interactions: Minimal scale feedback (active:scale-95)
- Form success: Checkmark animation after submission
- **Avoid**: Scroll-triggered animations, parallax effects, complex sequences

**Transition Utilities**:
- Standard: transition-all duration-200 ease-in-out
- Slower: transition-all duration-300 ease-in-out