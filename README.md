# Assignment 3: Inventory and Data Management System

**Course:** Web Dev III | **Unit:** 3 | **Marks:** 2.5
**Name:** Saurabh | **Roll No.:** 2501010045

## Stack

- Node.js, Express.js, MongoDB, Mongoose, dotenv

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   ```
3. Start the server:
   ```bash
   node server.js
   ```

## Project Structure

```
├── config/db.js              # MongoDB connection
├── controller/
│   └── productController.js  # All route handlers
├── middleware/
│   ├── errorHandler.js       # Centralized error handling
│   └── validate.js           # Input validation
├── model/product.js          # Mongoose schema
├── routes/productRoutes.js   # API routes
└── server.js                 # Entry point
```

## Schema — Product

| Field | Type | Validation |
|---|---|---|
| `name` | String | required |
| `sku` | String | required, unique |
| `category` | String | required |
| `price` | Number | required, min 0 |
| `quantity` | Number | min 0, default 0 |
| `reorderLevel` | Number | min 0, default 10 |
| `supplier` | String | optional |

> Virtual field `stockValue` = `price × quantity` is included in all responses.

## API Endpoints

### Products

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products` | Get all products (filter, sort, paginate) |
| `GET` | `/api/products/:id` | Get single product |
| `PUT` | `/api/products/:id` | Update product details |
| `PATCH` | `/api/products/:id` | Partial update |
| `PATCH` | `/api/products/:id/stock` | Adjust stock (`{ "change": 10 }`) |
| `DELETE` | `/api/products/:id` | Delete product |

### Reports

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/products/low-stock` | Products where `quantity ≤ reorderLevel` |
| `GET` | `/api/products/summary` | Category-wise inventory aggregation |

### Query Parameters — GET `/api/products`

| Param | Example | Description |
|---|---|---|
| `category` | `?category=Electronics` | Filter by category |
| `minPrice` | `?minPrice=100` | Minimum price filter |
| `maxPrice` | `?maxPrice=5000` | Maximum price filter |
| `search` | `?search=pen` | Search by name or SKU |
| `sort` | `?sort=price:asc` | Sort by field (`asc`/`desc`) |
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Results per page (default: 10) |

## Stock Adjustment

Send a `PATCH` to `/api/products/:id/stock` with:
```json
{ "change": 10 }
```
Positive values restock, negative values deduct. Deductions are blocked if quantity would go below 0.

