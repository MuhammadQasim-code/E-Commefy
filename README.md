# E-Commefy 🛍️

A full-stack e-commerce app built with the MERN-style stack (React + Node/Express + MongoDB). It's got everything a real online store needs auth, product catalog, cart, wishlist, checkout, and an admin panel for managing it all.

## Tech Stack

**Frontend:** React 19, React Router, Redux Toolkit, Tailwind CSS v4, Axios, Recharts, React Hot Toast

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth with refresh tokens, bcrypt, Multer for image uploads, Joi for validation

## Features

- **Auth** : register, login, logout, protected routes, token-based sessions
- **Browse & Search** : filters, sorting, pagination, category browsing
- **Product Pages** : image gallery, reviews, related products
- **Cart & Wishlist** : persisted to the backend, with stock checks and quantity controls
- **Checkout** : delivery form, COD or card (simulated), order confirmation
- **Admin Dashboard** : manage products, categories, users, and orders, plus sales charts
- **Responsive** ; works cleanly on mobile, tablet, and desktop

## Getting Started

You'll need Node.js 18+ and a MongoDB instance (Atlas or local).

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommefy
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

Seed the database (adds sample products and test accounts):

```bash
npm run seed
```

This gives you:
- Admin: `admin@ecommefy.com` / `Admin@123`
- Customer: `john@example.com` / `Customer@123`

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=E-Commefy
```

Start it up:

```bash
npm run dev
```

Open `http://localhost:5173` and you're in.

## Project Structure

```
E-Commefy/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── seeds/             # Database seeder
│   ├── uploads/           # Product images
│   ├── utils/             # Helpers (errors, tokens, schemas)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/           # Axios setup
    │   ├── app/            # Redux store
    │   ├── components/     # Reusable UI
    │   ├── features/       # Redux slices
    │   ├── hooks/           # Custom hooks
    │   ├── layouts/         # Page layouts
    │   ├── pages/            # Page views
    │   └── App.jsx
```

## API Overview

All routes are prefixed with `/api/v1`.

Auth: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh-token`, `/auth/profile`
 Products: `/products` (search/filter/sort), `/products/:id`, `/products/slug/:slug`, plus admin CRUD
 Cart/Wishlist: `/cart`, `/wishlist` (GET/POST/PUT/DELETE)
 Orders: `/orders`, `/orders/my-orders`, `/orders/:id/status` (admin), `/orders/stats` (admin)

 Deployment

 Database: MongoDB Atlas — whitelist `0.0.0.0/0` or your server's outbound IP
 Backend: Deploy on Railway/Render with root dir set to `backend`, build with `npm install`, start with `npm start`
 Frontend: Deploy on Vercel/Netlify with root dir set to `frontend`, build with `npm run build`, output to `dist`. Add a rewrite rule for React Router:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
