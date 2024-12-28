# Server-Side Product API

A RESTful API built with Express.js and MongoDB that provides server-side pagination, sorting, filtering, and grouping for product data.

## Features

- Server-side pagination
- Dynamic sorting
- Advanced filtering
- Data grouping
- Error handling middleware

## API Endpoints

### Get Products
`GET /api/products`

Supports the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 100)
- `sortField`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort direction ('asc' or 'desc')
- `category`: Filter by category
- `brand`: Filter by brand
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price
- `groupBy`: Group results by field

### Response Format
```json
{
    "status": "success",
    "data": [...products],
    "pagination": {
        "currentPage": 1,
        "limit": 100,
        "totalItems": 1000,
        "totalPages": 10
    },
    "groupedData": [...]
}
```

## Data Model

Product schema includes:
- name (String)
- price (Number)
- category (String)
- brand (String)
- createdAt (Date)

## Setup

1. Install dependencies:
```bash
npm install
