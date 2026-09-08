# SIH26033 - Reduce Intermediaries for Farmers

A complete working prototype of a **Farmer Direct Market Platform** that connects farmers directly with buyers and shows transparent earning comparisons.

## Problem Statement

> Multiple intermediaries reduce farmers earnings and increase consumer prices.

## What this prototype includes

- Farmer product listing (crop, quantity, expected price, location, harvest date)
- Buyer discovery and order placement
- Order/logistics status tracking
- **Smart Profit Estimator** (core feature):
  - Net earnings via direct channel (after transport)
  - Local/mandi benchmark comparison
  - Total gain/loss vs traditional route
- Seeded demo data for quick judging/demo setup

## Architecture

- **Frontend:** Next.js (React)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose

## Quick Start

### 1. Prerequisites

- Docker
- Docker Compose

### 2. Run

```bash
docker compose up --build
```

### 3. Access

- Frontend: http://localhost:3000
- Backend Health: http://localhost:4000/health

## Demo Flow for Judges

1. Farmer lists a product
2. Buyer places an order on listed product
3. Open **Smart Profit Estimator**
4. Pick product + buyer and enter local mandi price
5. Show:
   - "If sold via platform: ₹X/kg"
   - "Local market benchmark: ₹Y/kg"
   - "After transportation: estimated net profit ₹Z"
   - gain/loss compared to traditional chain

## API Endpoints

- `GET /health`
- `GET /api/products`
- `POST /api/products`
- `GET /api/buyers`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/profit-estimate`

### Sample payloads

`POST /api/products`

```json
{
  "farmerId": 1,
  "name": "Tomato",
  "quantityKg": 500,
  "expectedPricePerKg": 24,
  "harvestDate": "2026-09-20",
  "location": "Nashik"
}
```

`POST /api/orders`

```json
{
  "productId": 1,
  "buyerId": 1,
  "quantityKg": 120,
  "agreedPricePerKg": 26
}
```

`POST /api/profit-estimate`

```json
{
  "productId": 1,
  "buyerId": 1,
  "mandiPricePerKg": 19
}
```

## Traditional vs Direct Model in this prototype

- Traditional: Farmer → Agent → Wholesaler → Retailer → Consumer
- Direct: Farmer → Platform → Buyer

The estimator transparently computes potential farmer earning differences.
