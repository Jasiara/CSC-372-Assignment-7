# Jokebook Project

## Overview
Node/Express backend with Postgres database storing jokes and categories.
Frontend served from `public/` folder.

## Setup

1. Ensure PostgreSQL is installed and running.
2. Create a database, e.g. open a terminal and run:
   ```bash
   createdb jokebookdb
   ```
3. Run the SQL initialization to create tables and seed data:
   ```bash
   psql -d jokebookdb -f init_db.sql
   ```
4. Copy `.env.example` to `.env` and edit DATABASE_URL if needed:
   ```bash
   cp .env.example .env
   ```
   Example `.env`:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/jokebookdb
   PORT=3000
   ```

5. Install Node dependencies:
   ```bash
   npm install
   ```

6. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

## API Endpoints (as required)
- `GET /jokebook/categories` - returns `{ categories: [...] }`
- `GET /jokebook/category/:category?limit=` - returns `{ category, jokes: [...] }`
- `GET /jokebook/random` - returns one random joke `{ id, category, setup, delivery }`
- `POST /jokebook/add` - JSON body `{ category, setup, delivery }` - returns updated jokes for category

## Testing with Thunder Client or Postman
- Use `GET http://localhost:3000/jokebook/categories`
- Use `GET http://localhost:3000/jokebook/category/funnyJoke?limit=2`
- Use `GET http://localhost:3000/jokebook/random`
- Use `POST http://localhost:3000/jokebook/add` with JSON body:
  ```json
  { "category": "funnyJoke", "setup": "Hi", "delivery": "Bye" }
  ```

## Extra Credit
If a category is not present the server attempts to fetch up to 3 two-part jokes from JokeAPI (https://v2.jokeapi.dev). If found, the new category and jokes are inserted into the local DB.

## Note
Do not commit `node_modules` or `.env` file to source control.
