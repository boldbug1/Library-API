# Library API

A simple REST API built with Node.js and Express for managing a collection of books.

This project was created as a learning exercise to understand:

* Express routing
* Route parameters
* Query parameters
* Middleware
* HTTP methods
* CRUD operations
* JSON APIs
* Static file serving

## Features

### Create a Book

```http
POST /books
```

Request Body:

```json
{
  "title": "Clean Code",
  "author": "Robert Martin"
}
```

### Get All Books

```http
GET /books
```

### Get a Book by ID

```http
GET /books/:id
```

Example:

```http
GET /books/1
```

### Search Books

```http
GET /search?title=Clean Code
```

### Update a Book

```http
PATCH /books/:id
```

Request Body:

```json
{
  "title": "Clean Code 2nd Edition"
}
```

### Delete a Book

```http
DELETE /books/:id
```

## Project Structure

```text
library-api/
│
├── public/
│   └── index.html
│
├── server.js
├── package.json
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd library-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

Server will start on:

```text
http://localhost:3000
```

## API Testing

You can test the API using:

* Thunder Client
* Postman
* curl
* JavaScript fetch()

Example:

```bash
curl http://localhost:3000/books
```

## Current Limitations

* No database
* Data is stored in memory
* All books are lost when the server restarts
* No authentication
* No persistent storage

## Future Improvements

* Add SQLite or PostgreSQL
* Add request validation
* Split routes into separate modules
* Add controllers and middleware
* Add user authentication
* Add pagination and sorting

## Tech Stack

* Node.js
* Express.js

## License

This project is for educational purposes.
