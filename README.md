# Minimal E-Commerce App

## 1. Folder Structure

```text
client2/
  .env.example
  backend/
    src/
      config/db.js
      controllers/
        authController.js
        productController.js
      middleware/auth.js
      models/Product.js
      routes/
        authRoutes.js
        productRoutes.js
      server.js
    package.json
  frontend/
    src/
      components/
      context/
      lib/
      pages/
      App.jsx
      main.jsx
      index.css
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
```

## 2. Backend Code

- Express server: `backend/src/server.js`
- MongoDB connection: `backend/src/config/db.js`
- Product model: `backend/src/models/Product.js`
- Auth route + JWT login: `backend/src/routes/authRoutes.js`, `backend/src/controllers/authController.js`
- Product CRUD routes: `backend/src/routes/productRoutes.js`, `backend/src/controllers/productController.js`
- Admin middleware: `backend/src/middleware/auth.js`

## 3. Frontend Code

- App entry and routing: `frontend/src/main.jsx`, `frontend/src/App.jsx`
- Shared UI: `frontend/src/components/Layout.jsx`, `frontend/src/components/Navbar.jsx`, `frontend/src/components/ProductCard.jsx`
- Cart state: `frontend/src/context/CartContext.jsx`
- API helpers: `frontend/src/lib/api.js`
- Customer pages: `frontend/src/pages/HomePage.jsx`, `frontend/src/pages/ProductsPage.jsx`, `frontend/src/pages/ProductDetailPage.jsx`, `frontend/src/pages/CartPage.jsx`

## 4. Website Admin Panel

- Admin auth state: `frontend/src/context/AdminAuthContext.jsx`
- Protected route: `frontend/src/components/ProtectedRoute.jsx`
- Admin login page: `frontend/src/pages/admin/AdminLoginPage.jsx`
- Admin dashboard: `frontend/src/pages/admin/AdminDashboardPage.jsx`
- Admin URL: `/admin_login`
- Dashboard URL after login: `/admin`

## 5. Quick Start (Windows)

For a fully automated setup and startup, open this root folder in your terminal and run:

1. `npm run install-all`
2. `npm run dev`

Or double-click `run_project.bat` from the root folder.

## 6. Manual Setup Instructions

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy the root `.env.example` to the root `.env` and set:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `CLIENT_URL`
   - `VITE_API_URL`
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_STORE_NAME`
3. Start backend:
   ```bash
   npm run dev
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
5. Start frontend:
   ```bash
   npm run dev
   ```
6. Open the website admin at `/admin_login`

## API Endpoints

- `POST /auth/login`
- `POST /products`
- `GET /products`
- `GET /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`

## Notes

- Cart data is stored in `localStorage`.
- Checkout opens WhatsApp with a prefilled order message.
- Product create, update, and delete routes are protected with JWT.
- The admin panel is website-only now. There is no mobile app or APK in this repo.
- The project now uses a single root `.env` file for both backend and frontend settings.
