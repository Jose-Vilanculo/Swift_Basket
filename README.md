# 🛒 Swift Basket

A full-stack, multi-vendor ecommerce platform built with **Django REST Framework** and **React**.

Swift Basket allows buyers to browse products, manage their cart, place orders, receive invoices, and view their order history. The backend is designed around a multi-vendor architecture, with vendor stores, products, carts, orders, authentication, and vendor functionality supported through the REST API.

The frontend is currently focused on the **buyer experience**. Vendor registration and the vendor-facing environment are planned as the next major stage of development.

## 🌐 Live Demo

**Frontend:**  
https://swift-basket-blush.vercel.app/

**Backend API:**  
https://swiftbasket-production.up.railway.app/

---

## ✨ Features

### 👤 Authentication & User Accounts

- Custom Django user model
- Buyer and Vendor roles
- JWT authentication
- Access and refresh tokens
- Buyer registration and login
- Password reset functionality
- Password reset emails
- User profile management
- Profile image support

> **Current frontend limitation:** Buyer registration is currently available through the frontend. Vendor registration and the vendor dashboard are planned for a future development phase.

---

### 🛍️ Buyer Experience

- Browse products and categories
- Product search
- Product filtering
- Product detail pages
- Product ratings
- Product availability and stock handling
- Add products to cart
- Cart management
- Guest cart using `localStorage`
- Guest cart merging after authentication
- Checkout and shipping information
- Order creation
- Order history
- Invoice generation
- Invoice downloads
- Order confirmation emails
- Responsive design for desktop and mobile

---

### 🏪 Multi-Vendor Architecture

The backend supports the foundations of a multi-vendor ecommerce platform:

- Vendor user roles
- One store per vendor
- Store management
- Store images and banners
- Product management
- Product categories and subcategories
- Product variants
- Product stock management
- Vendor-specific permissions
- Vendor-owned products and stores

The **vendor frontend environment is currently under development** and will allow vendors to:

- Register as vendors
- Create and manage their store
- Add and manage products
- Manage product variants and stock
- View orders related to their products
- Access vendor-specific functionality through a dedicated dashboard

---

### 📦 Orders & Invoices

- Cart-to-order conversion
- Order items stored independently from cart items
- Shipping information saved with orders
- Automatic invoice generation using **ReportLab**
- Invoice PDFs stored using **Cloudinary**
- Secure invoice access through authenticated API endpoints
- Signed Cloudinary URLs for invoice delivery
- Invoice download functionality
- Order confirmation emails

---

### 📧 Email

Transactional emails are handled through the **Brevo API**.

Currently used for functionality such as:

- Password reset emails
- Order confirmation emails
- Invoice delivery

---

### ☁️ Cloud Storage

Product and user media are stored using **Cloudinary**.

Cloudinary currently handles:

- Product images
- Category images
- Store images
- Store banners
- User profile images
- Invoice PDFs

PDF invoices use Cloudinary's raw file storage.

---

### 🔐 API & Security

- Django REST Framework API
- JWT authentication
- Role-based permissions
- Buyer-specific order access
- Vendor-specific API permissions
- Backend stock validation
- Environment variables for secrets and configuration
- CORS configuration for the production frontend
- Production HTTPS configuration

---

## 🧰 Tech Stack

### Backend

- **Python**
- **Django**
- **Django REST Framework**
- **Simple JWT**
- **PostgreSQL**
- **SQLite** for local development
- **ReportLab**
- **Cloudinary**
- **Brevo API**
- **Gunicorn**
- **WhiteNoise**

### Frontend

- **React**
- **Vite**
- **JavaScript**
- **React Router**
- **Axios**
- **CSS Modules**
- **Lucide React / React Icons**

### Deployment

- **Railway** — Django backend & PostgreSQL
- **Vercel** — React frontend
- **Cloudinary** — Media & invoice storage
- **Brevo** — Transactional email

---



## 🚀 Running Locally

### 1. Clone the Repository

    git clone https://github.com/Jose-Vilanculo/Swift_Basket.git
    cd Swift_Basket

### 2. Create a Virtual Environment

    python -m venv vir-env

#### Windows

    vir-env\Scripts\activate

#### macOS/Linux

    source vir-env/bin/activate

### 3. Install Backend Dependencies

    pip install -r requirements.txt

### 4. Configure Environment Variables

Create a `.env` file in the Django project directory.

Example:

    SECRET_KEY=your-secret-key
    ENV=development

    FRONTEND_URL=http://localhost:5173

    DATABASE_URL=your-database-url

    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-api-key
    CLOUDINARY_API_SECRET=your-api-secret

    BREVO_API_KEY=your-brevo-api-key

> Never commit `.env` files, API keys, passwords, or other secrets to version control.

### 5. Run Database Migrations

    python manage.py makemigrations
    python manage.py migrate

### 6. Create a Superuser

    python manage.py createsuperuser

### 7. Start the Django Development Server

    python manage.py runserver

The backend will be available at:

    http://127.0.0.1:8000

---

## ⚛️ Running the React Frontend

Open a second terminal:

    cd frontend

Install dependencies:

    npm install

Start the Vite development server:

    npm run dev

The frontend will normally be available at:

    http://localhost:5173

---

## 📡 REST API

The backend provides REST API endpoints for the application's major resources.

### Authentication

    POST /api/token/
    POST /api/token/refresh/

### Products

    GET /api/products/
    GET /api/products/<id>/

### Categories

    GET /api/categories/

### Cart

    GET /api/cart/
    POST /api/cart/

### Orders

    GET /api/order/
    POST /api/order/
    GET /api/order/<id>/
    GET /api/order/<id>/invoice/

### Stores

Store and vendor-related API functionality is available in the backend and is being prepared for the upcoming vendor frontend.

> The API contains functionality that is not currently exposed through the React frontend. The frontend is currently focused on the buyer experience.

---

## 🧪 Testing

Run Django tests with:

    python manage.py test

---

## 📱 Responsive Design

Swift Basket is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The frontend uses responsive layouts and mobile-specific UI behaviour for features such as navigation and the shopping cart.

---

## 🔒 Environment Variables

Sensitive configuration is kept outside the repository using environment variables.

Examples include:

    SECRET_KEY
    DATABASE_URL
    CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    BREVO_API_KEY
    FRONTEND_URL

These values should never be committed to Git.

---

## 🗺️ Roadmap

### ✅ Completed

- [x] Django backend
- [x] Django REST Framework API
- [x] Custom user model
- [x] Buyer authentication
- [x] JWT authentication
- [x] Product catalogue
- [x] Categories & subcategories
- [x] Product variants
- [x] Product search
- [x] Shopping cart
- [x] Guest cart
- [x] Guest-to-user cart merging
- [x] Checkout
- [x] Order creation
- [x] Order history
- [x] Invoice generation
- [x] Cloudinary media storage
- [x] Cloudinary invoice storage
- [x] Invoice downloads
- [x] Brevo transactional email
- [x] Responsive React frontend
- [x] Railway backend deployment
- [x] PostgreSQL production database
- [x] Vercel frontend deployment

### 🚧 Next Major Phase — Vendor Environment

- [ ] Vendor registration frontend
- [ ] Vendor login flow
- [ ] Vendor dashboard
- [ ] Store creation interface
- [ ] Store management
- [ ] Product creation interface
- [ ] Product editing and deletion
- [ ] Product variant management
- [ ] Inventory management
- [ ] Vendor order management
- [ ] Vendor-specific analytics
- [ ] Vendor profile/settings

### 🔮 Future Improvements

- [ ] Production payment gateway
- [ ] Product reviews frontend
- [ ] Advanced search and filtering
- [ ] Wishlist functionality
- [ ] Improved order tracking
- [ ] Vendor analytics
- [ ] Admin dashboard improvements
- [ ] Automated testing expansion
- [ ] Performance optimizations
- [ ] Skeleton loading states
- [ ] Further UI/UX improvements

---

## 📌 Current Project Status

Swift Basket is currently in active development.

The **backend API already contains the foundations for both buyers and vendors**, but the React frontend currently exposes the **buyer experience only**.

The next major development phase is building the vendor-facing frontend, allowing vendors to register, create their stores, manage products, manage inventory, and access functionality specific to running their store.

---

## 👨‍💻 Author

**Jose Vilanculo**

GitHub:

https://github.com/Jose-Vilanculo
