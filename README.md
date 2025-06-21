# Library Management System API

A backend API for managing books and borrow records in a library. Built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**.

---

##  Features

*  Create, read, update, and delete books
*  Borrow books with business logic enforcement
*  Auto update availability based on stock
*  Aggregation pipeline summary of borrowed books
*  Mongoose middleware (pre/post)
*  Static method for business logic
*  Filtering, sorting, and pagination on book list

---

##  Tech Stack

* Express.js
* TypeScript
* MongoDB + Mongoose

---

##  Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/library-api.git
cd library-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your MongoDB URI and JWT_SECRET

# Run the server in development mode
tsc
node dist/server.js

```

---

##  Folder Structure

```
dist                 # typescript compiled output files 
src/
  app.ts             # Express app initialization and root file
  server.ts          # connect mongoose,root file and app listen with port
  modules/
    book/            # Book model, controller, routes
    borrow/          # Borrow model, controller, routes

```

---

## 🌐 API Endpoints

### 1. Create a Book

`POST /api/books`

```json
Request:
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

### 2. Get All Books (Filtering + Sorting)

`GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5`

### 3. Get Book by ID

`GET /api/books/:bookId`

### 4. Update Book

`PUT /api/books/:bookId`

```json
{
  "copies": 10
}
```

### 5. Delete Book

`DELETE /api/books/:bookId`

---

### 6. Borrow a Book

`POST /api/borrow`

Business Logic:

* Quantity must not exceed available copies
* Copies are auto-deducted
* If stock = 0, availability is updated to false

```json
Request:
{
  "book": "<bookObjectId>",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

### 7. Borrow Summary (Aggregation)

`GET /api/borrow`

Response:

```json
[
  {
    "book": {
      "title": "The Theory of Everything",
      "isbn": "9780553380163"
    },
    "totalQuantity": 5
  }
]
```

---

##  Error Format

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError"
      }
    }
  }
}
```

---

##  Testing (Optional)

Use Postman or Thunder Client to test the API.

---

##  Future I will add here

* Add user login & authentication
* Book return & late fee tracking
* Advanced analytics on borrow trends




