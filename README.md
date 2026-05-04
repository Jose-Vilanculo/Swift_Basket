# Django News Application

A Django-based Ecommerce application platform for Vendors and Buyers to trade. Supports **Multiple-Vendors**, Multiple buyers, user carts, product reviews, orders, and integrations with **email** and **X (Twitter)**.

## 📌 Features

- **Custom user roles**: Vendors, Buyers
- **Vendors** Can create online stores(One per user) and add products to their store which includes: A product image, Title, a description and a price
- **Buyers**: Can add items from multiple stores to their carts and then checkout items. One buyers checks out their cart an invoice will be sent to them via email where they can then make payments for their order. Order history is also saved and accessible on the buyers portal. Buyers can also leave reviews on products.
- **Automatic email & X (Twitter) posting** for orders and the creation of new stores and products
- **REST API** for multiple purposes
- **Responsive frontend** (Bootstrap)
- **MYSQL** database backend

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Jose-Vilanculo/Django-eCommerce-Application

cd Django-eCommerce-Application
```
### 2. Create & Activate Virtual Environment
```bash
python -m venv vir-env
```
- **Windows**:  
  ```bash
  vir-env\Scripts\activate
  ```
- **macOS/Linux**:  
  ```bash
  source vir-env/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

## 🗄️ MYSQL Setup

1. **Install MYSQLclient** → [Download](https://dev.mysql.com/downloads/installer/)  
2. **Create Database & User**:
   ```sql
   CREATE DATABASE store_app CHARACTER SET utf8mb4;
   CREATE USER 'store_user'@'localhost' IDENTIFIED BY 'store_password';
   GRANT ALL PRIVILEGES ON store_app.* TO 'store_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. **Configure `settings.py`**:
   ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': os.environ.get('DB_NAME', 'storedb'),
          'USER': os.environ.get('DB_USER', 'storeuser'),
          'PASSWORD': os.environ.get('DB_PASSWORD', 'store_password'),
          'HOST': os.environ.get('DB_HOST', 'db'),
          'PORT': os.environ.get('DB_PORT', '3306'),
          'OPTIONS': {
              'charset': 'utf8mb4',
          },
      }
  }
   ```
4. **Install MySQL client**:
   ```bash
   pip install mysqlclient
   ```

## 📧 Email Configuration

In `settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.yourprovider.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@example.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```
> ⚠️ Keep credentials out of version control. Use environment variables.

## 🐦 Twitter Integration

In `settings.py`:
```python
TWITTER_API_KEY = 'your-api-key'
TWITTER_API_SECRET = 'your-api-secret'
TWITTER_ACCESS_TOKEN = 'your-access-token'
TWITTER_ACCESS_SECRET = 'your-access-secret'
```
> Obtain keys from the [Twitter Developer Portal](https://developer.twitter.com/). Secrets must **never** be committed.


Run:

## ▶️ Running Locally (Non-Docker)
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Visit: **http://127.0.0.1:8000**

## 🧪 Testing
```bash
python manage.py test
```

## 📡 REST API
- View all stores:  
  `GET /api/stores/`
- View a specific store:
  `GET /api/store/<uuid:pk>/`
- View a specific product:
  `GET /api/product/<uuid:pk>/`
- View reviews from a specific product:
  `GET /api/product/<uuid:pk>/reviews/`
- Create a store:
  `POST /api/create/store/`
- CREATE a product:
  `POST /api/create/product/`
- Use tools like Postman for authentication & queries.

## 📝 Notes
- Only Vendors can create Stores and Products.
- Only Buyers can purchase items.
- `.gitignore` should exclude `.env` and other secret files.
