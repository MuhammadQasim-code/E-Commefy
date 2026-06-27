# E-Commefy — Walkthrough

All development phases of **E-Commefy** are successfully completed. The project is verified to compile and run smoothly on both the backend and frontend.

---

## 🛠️ Key Milestones Achieved

### 0. Validation & Authentication Bug Fixes (High Priority)
- **Root Cause**: Validation helper functions (`validateEmail`, `validatePassword`, `validatePhone`) return `""` (an empty string) on success, and a descriptive message (string) on failure. Several form components (`Login.jsx`, `Register.jsx`, `CheckoutForm.jsx`, and `Profile.jsx`) were double-negating these checks (e.g., `!validateEmail(...)`), which incorrectly marked valid inputs as invalid, blocking successful login and signups.
- **Resolution**: Modified all validation checks to inspect for truthy error string returns.
- **Result**: Users can now successfully log in as the Administrator (`admin@ecommefy.com`) or as Customers on the UI.

### 0.1. ProductFilters Prop Type Crash Fix
- **Root Cause**: The catalog page (`Products.jsx`) rendered the `<ProductFilters />` component without passing the required `filters` and `onFilterChange` props. This caused an immediate crash (`Cannot read properties of undefined (reading 'search')`) when the filters component attempted to read default state values on mount.
- **Resolution**: Initialized the `filters` state from URL search params in `Products.jsx` and passed both `filters` and the `handleFilterChange` callback as props to `<ProductFilters />` on both the desktop sidebar and mobile drawer.
- **Result**: The product catalog page filters and search are now fully operational.

### 0.2. Offline/Fallback Placeholder Image & Slash Normalization Fixes
- **Root Cause**: Fallback product images were resolving to `https://via.placeholder.com/300x300`, which was blocked or timing out in the user's environment. In addition, the frontend was attempting to access `product.images[0].url`, which was `undefined` since `images` in the Mongoose schema is a simple array of path strings, not objects. Furthermore, local file paths stored in the DB (like `uploads/filename.jpg`) were concatenated without checking for leading slashes, causing malformed URLs like `http://localhost:5000uploads/filename.jpg`.
- **Resolution**: Deployed a premium, inline Base64 SVG placeholder that renders offline and matches the app's visual style. Corrected the code to access string array indexes directly and normalized the leading slashes before constructing local backend image URLs in `ProductCard.jsx`, `ProductImageGallery.jsx`, `Home.jsx`, and `ManageCategories.jsx`.
- **Result**: Fallback images load instantly offline, and uploaded local product/category images are correctly resolved and rendered.

### 0.3. Multi-Category Filtering Support Fix
- **Root Cause**: Two issues were present:
  1. The frontend category checkbox list checked for `cat._id` inside `filters.category`, but when coming from the home page, the URL query parameter was set to the category slug (e.g. `?category=electronics`), causing the checkboxes to look unchecked.
  2. The backend product controller only parsed a single category string value. When multiple categories were checked in the UI, a comma-separated list of slugs/IDs (e.g. `?category=automotive,books`) was sent, which failed validation and bypassed filtering.
- **Resolution**:
  - Updated `ProductFilters.jsx` to map and check selections using both `_id` and `slug` properties, and toggle selections cleanly by slug in the search parameters.
  - Rewrote the backend `getAllProducts` controller category filter block to parse comma-separated values, resolve category slugs to ObjectIds dynamically, and use Mongoose's `$in` operator.
- **Result**: Selecting multiple categories now filters the catalog correctly and checkboxes sync properly with URL states.

### 0.4. Catalog Filtering, Default Sorting, and Pagination Fixes
- **Root Cause**: Three bugs were identified on the products catalog page:
  1. **Server Offline**: The backend server was offline, meaning any multi-category updates were not actively running.
  2. **Pagination Broken**: The prop names passed to `<Pagination>` in `Products.jsx` (`currentPage` and `totalPages`) did not match the destructured prop names (`page` and `pages`) inside `Pagination.jsx`, preventing page transitions and hiding additional items.
  3. **Default Sorting & Dropdown**: The sort state was forced to "Latest Arrivals" initially without an option to clear sorting or use the database natural default order.
  4. **Redundant Drawers**: `ProductFilters.jsx` rendered a duplicate mobile drawer inside the drawer of `Products.jsx`, resulting in a broken nested filter drawer.
- **Resolution**:
  - Restored backend server and tested comma-separated category slug querying.
  - Updated `Pagination.jsx` to parse and normalize both `page`/`pages` and `currentPage`/`totalPages` sets of properties, and corrected the calling convention in `Products.jsx`.
  - Added a "Default Sorting" select option (`value=""`) to `Products.jsx` and updated the backend sorting logic to fall back to natural database order `{}` if `sort` query param is empty.
  - Simplified `ProductFilters.jsx` to render filter content directly, allowing `Products.jsx` to control its responsive layout container without duplicate drawer components.
- **Result**: Catalog page loads all items, displays correct pagination, defaults to Default Sorting, and filters multiple categories cleanly on both desktop and mobile layouts.

### 0.5. Cart Deletion and Checkout Submission Fixes
- **Root Cause**: Two primary functional issues were present:
  1. **Not Authenticated during Deletion/Order**: The `accessToken` cookie had a short `maxAge` of 15 minutes set on the backend. After 15 minutes, the browser deleted the cookie, sending no cookie at all. The server then returned `Not authenticated` (401), which was not handled by the client's `'token expired'` check in the Axios interceptor, preventing silent refresh and locking the user out.
  2. **Checkout Submission Form Selector Collision**:
     - The "Place My Order" button inside `OrderSummary.jsx` had `type="submit"` but was outside the `<form>` element, doing nothing when clicked.
     - The secondary "Confirm Details & Pay" button used JS selector `document.querySelector('form')` which incorrectly matched other pages' forms (like the Newsletter signup form in the footer) rather than the checkout form, blocking order creation.
  3. **Order Stats Slice Unwrapping Bug**: The `fetchOrderStats` thunk returned `data.data.stats` which was undefined since the stats API directly returned stats properties on `data.data`.
- **Resolution**:
  - Prolonged the `accessToken` cookie `maxAge` to 7 days on the backend so the browser retains it, allowing the JWT verification to naturally expire and return `Token expired` (which Axios intercepts and refreshes).
  - Updated the client-side Axios response interceptor to catch both `'token expired'` and `'not authenticated'` status code 401s, ensuring seamless refresh triggers even if the cookie goes missing.
  - Fixed `CheckoutForm.jsx` by assigning a unique `id="checkout-form"` to the `<form>`.
  - Added the native HTML5 `form="checkout-form"` attribute to the submit buttons in `OrderSummary.jsx` and `Checkout.jsx`, eliminating error-prone JS document query selectors entirely.
  - Corrected `orderSlice.js` `fetchOrderStats` to return `data.data` directly.
- **Result**: Items can now be successfully removed from the cart, and orders are correctly submitted and placed via the native HTML5 form association.

### 0.6. Admin Dashboard Stats and Chart Fixes
- **Root Cause**: Two issues occurred on the Admin Dashboard page:
  1. **Recharts crash**: The `OrderStatusChart` in `Charts.jsx` crashed with `data.map is not a function` because the backend API returned `ordersByStatus` as a key-value object (e.g. `{ Pending: 5 }`), while Recharts `.map` expects an array.
  2. **Empty metrics**: The dashboard cards ("Products Catalog", "Total Users") and the sales trend chart were displaying 0 or empty because the `/orders/stats` endpoint did not aggregate or return those statistics.
- **Resolution**:
  - Modified `Charts.jsx` `OrderStatusChart` to support both array and key-value object data shapes gracefully (using `Object.entries` to construct the chart dataset if an object is passed).
  - Updated the backend `/orders/stats` controller in `orderController.js` to count total products, users, and aggregate monthly sales revenue trends over the last 12 months.
- **Result**: The Admin Dashboard loads cleanly without crashes and displays all metrics and charts (sales area chart, statuses pie chart) correctly.

### 1. Backend Core & Database Integration
- **Server Setup**: Initialized Node.js/Express application equipped with CORS, rate-limiting, cookieParser, Helmet headers, and gzip compression.
- **Mongoose Schemes**: Configured schemas for `User` (with pre-save hashing & comparison methods), `Product` (with full text search indexes), `Category` (with auto slug generation), `Order` (with unique ECF order reference generator), `Review` (with average rating calculation triggers), `Cart`, and `Wishlist`.
- **API Endpoints**: Deployed RESTful API endpoints matching all required features.
- **Robust DNS Fix**: Added a DNS fallback override resolving directly through Google DNS (`8.8.8.8`) at Mongoose connection startup. This completely bypasses local DNS failures (`querySrv ECONNREFUSED`) common in Windows home network setups.
- **Seeding Accomplished**: Successfully ran the seed script, populating the MongoDB Atlas database with **8 categories, 30 realistic products, 10 sample reviews, and test user/admin accounts**.

### 2. Frontend Application
- **Vite & React Setup**: Cleaned out standard template files (`main.ts`, `counter.ts`, `style.css`) and deployed a modern React-router structure.
- **Tailwind CSS v4 styling**: Configured and bundle-built v4 styles, including base, webkit scrollbars, animations, and custom theme tokens.
- **Redux State Management**: Created the centralized store and async slices managing state for Auth, Products, Wishlist, Cart, Categories, Users, Orders, and Theme preferences.
- **Dark/Light Theme Toggle**: Implemented a responsive theme switch that modifies document-root classes and stores preferences inside `localStorage`.
- **Reusable Layouts & Components**: Wrote layout structures (`MainLayout`, `AdminLayout` with mobile navigation slider) and reusable components (`DataTable`, `Charts` for Recharts graphs, `ProductCard`, `EmptyState`, `Modal`, `StarRating`, `Toast`).
- **Complete Views Implementation**:
  - Customer Pages: `Home`, `About`, `Products Catalog` (with filters & search), `ProductDetails` (with gallery & review submit form), `Cart` (with quantities), `Wishlist` (with quick move-to-cart), `Checkout` (with simulated payment methods), `OrderSuccess`, and `Profile`.
  - Admin Pages: `Dashboard` (analytics summary charts), `ManageProducts`, `ManageCategories` (with modals), `ManageOrders` (with direct status transition selector dropdown), and `ManageUsers` (with role modifications).

---

## 🔬 Build & Validation Results

### 1. Database Seeder
Successfully ran the database seeder to populate MongoDB Atlas. In this seeder pass, **all 8 categories and 30 products were successfully seeded with high-quality, real Unsplash product and cover image URLs**.
```bash
🌱 SEED COMPLETE!
👤 Users:      3 (1 admin + 2 customers)
📁 Categories: 8
📦 Products:   30
⭐ Reviews:    10
```

### 2. Backend Server Execution
Started the Express application. Output logs confirmed:
```
🚀 E-Commefy API Server running in development mode on port 5000
📡 API Base URL: http://localhost:5000/api/v1
✅ MongoDB Connected: ac-xpsiski-shard-00-00.anfx65a.mongodb.net
```

### 3. Frontend Bundle Compiler
Successfully ran `npm run build` inside the `frontend` directory. All routes built with zero Rolldown compilation or TypeScript warnings:
```bash
vite v8.1.0 building client environment for production...
transforming...✓ 566 modules transformed.
rendering chunks...
✓ built in 2.30s
```

---

## 📋 Credentials Checklist

You can test the application with the following seeded accounts:

- **Administrator**:
  - **Email**: `admin@ecommefy.com`
  - **Password**: `Admin@123`
- **Customer**:
  - **Email**: `john@example.com`
  - **Password**: `Customer@123`
