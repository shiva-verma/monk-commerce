
```markdown
# 🛍️ Discount Service

A lightweight, extensible service for managing and applying discount coupons in shopping cart workflows.

> **Note:** Buy X Get Y (BXGY) coupons do not auto-apply — both the “buy” and “get” products must be present in the cart for the discount to be valid.

---

## 📁 Project Structure

```
- **build/**: Compiled JavaScript files
- **src/**: TypeScript source code
  - controllers/: API endpoint handlers
  - data/: Data models and storage, use in-memory storage for coupons
  - model/: Zod validation schemas
  - routes/: API route definitions
  - services/: Core business logic
  - types/: typescript types
  - utils/: Helper functions
  - main.ts: Application entry point

````

---

## Features Implemented

### Discount Support

- **Cart-wide Percentage Discounts (`CART_WISE`)**
- **Product-specific Discounts (`PRODUCT_WISE`)**
- **Buy X Get Y Deals (`BXGY`)**

### 🔐 API Endpoints

#### Coupon Management

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/coupons` | List coupons |
| `GET` | `/api/coupons/:couponId` | Get coupon by ID |
| `POST` | `/api/coupons` | Create a new coupon |
| `PUT` | `/api/coupons/:couponId` | Update a coupon |
| `DELETE` | `/api/coupons/:couponId` | Delete a coupon |

#### Discount Application

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/applicable-coupons` | Find applicable coupons for a cart |
| `POST` | `/api/apply-coupon/:couponId` | Apply a specific coupon |

---

## 🧠 Core Utilities

- Standardized HTTP responses
- Central error handling & masking
- Expiration checks
- Cart total and discount application logic

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (LTS or higher)
- npm or yarn

### Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd monk-commerce
````

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Build the code:

   ```bash
   npm run build
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. For development with auto reload:

   ```bash
   npm run dev
   ```

By default, the API runs at **[http://localhost:3000/api](http://localhost:3000/api)**. You can set a custom port using the `PORT` environment variable.

---

## 🧪 API Usage Examples

Use curl, Postman, or similar tools.

### 📌 Coupon Management

#### List Coupons

```bash
curl "http://localhost:3000/api/coupons?showExpired=true"
```

#### Create a Cart-Wide Discount

```bash
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "CART_WISE",
    "discountPercentage": 10,
    "threshold": 100,
    "endDate": "2024-12-31"
  }'
```

#### Create a Product-Specific Discount

```bash
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "PRODUCT_WISE",
    "discountPercentage": 15,
    "productWiseProducts": [
      { "productId": "prod-123", "quantity": 1 },
      { "productId": "prod-456", "quantity": 2 }
    ],
    "threshold": 50,
    "endDate": "2024-12-31"
  }'
```

#### Create a BXGY Coupon

```bash
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "BXGY",
    "buyProducts": [
      { "productId": "prod-123", "quantity": 2 }
    ],
    "getProducts": [
      { "productId": "prod-456", "quantity": 1 }
    ],
    "endDate": "2024-12-31"
  }'
```

---

### 🛍️ Discount Application

#### Find Applicable Coupons

```bash
curl -X POST http://localhost:3000/api/applicable-coupons \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": "prod-123", "quantity": 2, "price": 50 },
      { "productId": "prod-456", "quantity": 1, "price": 75 }
    ]
  }'
```

#### Apply a Coupon

```bash
curl -X POST http://localhost:3000/api/apply-coupon/your-coupon-id \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": "prod-123", "quantity": 2, "price": 50 },
      { "productId": "prod-456", "quantity": 1, "price": 75 }
    ]
  }'
```

---

## 🧠 Example Workflow

1. **Create a cart-wide discount**:

   ```bash
   curl -X POST http://localhost:3000/api/coupons \
     -H "Content-Type: application/json" \
     -d '{
       "discountType": "CART_WISE",
       "discountPercentage": 10,
       "threshold": 100,
       "endDate": "2024-12-31"
     }'
   ```

2. **Check applicable coupons**:

   ```bash
   curl -X POST http://localhost:3000/api/applicable-coupons \
     -H "Content-Type: application/json" \
     -d '{
       "items": [
         { "productId": "prod-123", "quantity": 3, "price": 40 }
       ]
     }'
   ```

3. **Apply the coupon**:

   ```bash
   curl -X POST http://localhost:3000/api/apply-coupon/GENERATED_COUPON_ID \
     -H "Content-Type: application/json" \
     -d '{
       "items": [
         { "productId": "prod-123", "quantity": 3, "price": 40 }
       ]
     }'
   ```

Response will include totals, discount value, and final price.

---

## 📡 Health Endpoint

```bash
curl http://localhost:3000/api/health
```

---

## 🧩 What’s Next

This service is functional and extensible. Some future improvements could include:

* Persistent storage (DB instead of arrays)
* Authentication/Authorization
* Advanced discount logic
* Test coverage
* Analytics and usage tracking

---

