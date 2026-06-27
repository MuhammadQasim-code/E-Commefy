# E-Commefy 🛍️ — Production-Ready Full-Stack E-Commerce Web Application

E-Commefy is a professional, deployable, and feature-rich full-stack e-commerce web application. Built using modern software engineering principles and architectural best practices, it showcases skills in both frontend development (React + Redux Toolkit + Tailwind CSS v4) and backend systems (Node.js + Express + MongoDB Atlas).

---

## 🚀 Tech Stack

### Frontend
- **React.js** (v19) — JSX, Hooks, Code-splitting (Lazy loading)
- **React Router DOM** (v7) — Layout routing, Protected routes
- **Redux Toolkit** — State slices, Async thunks, Theme toggle
- **Axios** — Instance config, Token auto-refresh interceptors
- **Tailwind CSS v4** — Utility-first styling with modern dark/light system
- **Recharts** — Responsive admin dashboard analytics charts
- **React Hot Toast** — Elegant toast notifications

### Backend
- **Node.js** & **Express.js** — REST API architecture
- **MongoDB Atlas** & **Mongoose ODM** — Database layers, validation schemas
- **JWT (JSON Web Token)** — Stateless authentication + cookie-based refresh tokens
- **bcryptjs** — Password hashing (salt round 12)
- **Multer** — Local product image uploads
- **Helmet, CORS, Compression, Morgan** — Middleware for security, logging, and gzip compression
- **Joi** — Request payload schema validation

---

## 🛠️ Main Features

- **Authentication System** — Register, login, logout, protected routes, and session persistence via tokens.
- **Home Page** — Hero banner, featured carousel, category browser, trust badges, and newsletter signup.
- **Products Catalog** — Real-time search, category filters, price bounds, rating thresholds, multi-option sorting (Price low-to-high, high-to-low, latest, best selling), and page-by-page pagination.
- **Product Details** — Dynamic image gallery, product description, tabs for specs and buyer reviews, related products carousel, and direct checkout shortcuts.
- **Cart & Wishlist** — API-persisted cart (quantity controls, stock checking, tax & shipping calculations) and wishlist (add/remove/move to cart).
- **Checkout Flow** — Detailed delivery form, simulated payment option (COD vs card), order registration, and receipt details success page.
- **Admin Panel** — Full CRUD management for products, categories, users (update roles, block), orders (update status workflow), and aggregate business charts (sales trend and order status split).
- **Responsive Design** — Custom-designed UI adjusting cleanly across mobile, tablet, and desktop viewports.

---

## 📂 Project Architecture

```
E-Commerce/
├── backend/
│   ├── config/             # MongoDB database connection configuration
│   ├── controllers/        # Route controllers (business logic)
│   ├── middleware/         # Auth, admin guard, error, uploads, validation middlewares
│   ├── models/             # Mongoose schemas (User, Product, Category, Order, etc.)
│   ├── routes/             # Express API endpoints
│   ├── seeds/              # Database seeder (30+ products, admin credentials)
│   ├── uploads/            # Local product images directory
│   ├── utils/              # ApiError, ApiResponse, token generators, Joi schemas
│   ├── .env.example
│   └── server.js           # Server entry point
│
└── frontend/
    ├── public/             # Static public assets (Favicon, icons)
    ├── src/
    │   ├── api/            # Axios setup with interceptors
    │   ├── app/            # Redux store configuration
    │   ├── components/     # Reusable UI parts (cart, checkout, admin, common)
    │   ├── features/       # Redux state slices (auth, products, theme, etc.)
    │   ├── hooks/          # Custom utility hooks (useAuth, useTheme, useCart)
    │   ├── layouts/        # Layout shells (MainLayout, AdminLayout)
    │   ├── pages/          # Full page view containers (Home, Catalog, Dashboard)
    │   ├── utils/          # Formatting helpers, frontend validators
    │   ├── App.jsx         # Routes map
    │   ├── index.css       # Tailwind CSS v4 styling rules
    │   └── main.jsx        # App mounting entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- MongoDB Atlas cluster or Local MongoDB instance

### Step 1: Clone & Initialize Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommefy
JWT_SECRET=generate_your_jwt_secret_here
JWT_REFRESH_SECRET=generate_your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

### Step 2: Seed the Database
Populate your database with categories, reviews, and test accounts:
```bash
npm run seed
```
This sets up the following credentials:
- **Admin User**: `admin@ecommefy.com` / `Admin@123`
- **Customer User**: `john@example.com` / `Customer@123`

### Step 3: Start the Backend Server
```bash
npm run dev
```

### Step 4: Initialize Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=E-Commefy
```

### Step 5: Start Frontend Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Documentation

All API endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register` — Create a customer account
- `POST /auth/login` — Login with credentials (sets HTTP-only cookie)
- `POST /auth/logout` — Revoke tokens and logout
- `POST /auth/refresh-token` — Rotate access token
- `GET /auth/profile` — Fetch logged-in user profile

### Products
- `GET /products` — Query catalog with search, filters, pagination, and sorting
- `GET /products/featured` — Get featured items
- `GET /products/slug/:slug` — Get product details by slug
- `GET /products/:id` — Get product details by ID
- `POST /products` — Add product (Admin only, accepts image files)
- `PUT /products/:id` — Edit product (Admin only)
- `DELETE /products/:id` — Remove product (Admin only)
- `POST /products/:id/reviews` — Submit review & rating (Customer only)

### Cart & Wishlist
- `GET /cart` — Fetch current user's cart
- `POST /cart` — Add product to cart
- `PUT /cart/:itemId` — Adjust item quantity in cart
- `DELETE /cart/:itemId` — Remove item from cart
- `DELETE /cart` — Clear all cart items
- `GET /wishlist` — Fetch current user's wishlist
- `POST /wishlist` — Save item to wishlist
- `DELETE /wishlist/:productId` — Remove item from wishlist

### Orders
- `POST /orders` — Create new order
- `GET /orders/my-orders` — Get personal order history
- `GET /orders` — List all orders (Admin only)
- `PUT /orders/:id/status` — Modify delivery status (Admin only)
- `GET /orders/stats` — Retrieve analytics aggregates (Admin only)

---

## 🚢 Deployment Guide

### Database (MongoDB Atlas)
Whitelist all IPs (`0.0.0.0/0`) under Network Access settings or map your cloud server's outbound IP.

### Backend (Railway / Render)
1. Link your GitHub repository.
2. In your service configuration, set the root directory to `backend`.
3. Add Environment variables mirroring your backend `.env` (changing `CLIENT_URL` to your production frontend URL).
4. Set Build command to `npm install` and Start command to `npm start`.

### Frontend (Vercel / Netlify)
1. Link your GitHub repository.
2. Set root directory to `frontend`.
3. Configure Environment variables: `VITE_API_URL` (pointing to your deployed backend URL).
4. Set Build command to `npm run build` and Output directory to `dist`.
5. For React Router fallback matching in production, add a `vercel.json` rewrite file:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
