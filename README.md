# LenDenClub – Real-time Transaction & Audit Log System

## Project Overview

This project implements the **"Assignment 2: Real-time Transaction & Audit Log System"**
and the Challenge was to implement a  **"Simple Fund Transfer and Audit Trail"**
as part of the Backend Graduate Engineer Trainee (GET) assignment for LenDenClub.

The system simulates a **peer-to-peer fund transfer** between users while ensuring
**atomic database transactions** and maintaining an **immutable audit log** in the database.
The focus of the implementation is correctness, data consistency, and clean
backend design, aligned with real-world fintech systems.

### Key Points of the assignment
- Atomic fund transfers using PostgreSQL transactions
- Guaranteed consistency (debit & credit succeed together or fail together)
- Persistent audit trail will be inserted into the DB for every successful transfer
- Real-time UI updates will be displayed for Balance and Transaction history as soon as a successful transfer is performed
- Sorting of transaction history in ASC and DESC(by default) through backend queries.

### Tech Stack

### Backend -
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- pgAdmin (database management)

### Frontend -
- React.js
- Axios
- Plain CSS (for clean and minimal UI)

---

## Setup & Run Instructions

### Prerequisites
- Node.js installed
- PostgreSQL
- pgAdmin (optional but recommended)

### How to setup the project
- Clone the repository in a folder.
- You will see two folders ->
  1) simple-fund-audit
  2) simple-fund-audit-backend
- Inside *simple-fund-audit* folder run `pnpm install` to install all the required dependencies
- Inside *simple-fund-audit-backend* folder run `pnpm install` to install all the required backend dependencies

- > Inside the *simple-fund-audit-backend* folder create a `.env` file and add a varible named `DB_PASS` with your Database password for PostgresSQL(pgAdmin)

- Start the backend using `nodemon start` which will start the server on the `PORT = 9090`
- Start the frontend using `pnpm run dev` which will start the *Vite server* on `localhost: 5173`

---

### How to setup the Database
- Use `pgAdmin` of PostgreSQL for database management.
- Create a Database name: `payment_system` OR name it as per your choice.
- Create two tables ->
  1) `users` table:
     ```
      CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       balance NUMERIC(10,2) NOT NULL DEFAULT 0
      );
  2) `transactions` table:
     ```
     CREATE TABLE transactions (
       id SERIAL PRIMARY KEY,
       sender_id INT,
       receiver_id INT,
       amount NUMERIC(10,2),
       status VARCHAR(20),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  3) > In `connectDB.js`, change `user` and `database` variables as per your configurations in `pgAdmin`
  4) Insert sample users:
     ```
     INSERT INTO users (name, balance)
     VALUES ('User A', 3000), ('User B', 5000);
---

## API Documentation

### -> POST `/api/transfer`
  Transfers amount from sender to receiver using a single database transaction.
  
  Request Body: 
  
    {
      "senderId": 1,
      "receiverId": 2,
      "amount": "200"
    }

  Response:
  
    {
      "message": "Transfer successful"
    }

### -> GET `/api/transactions/:userId`
  Fetches transaction history for a user (sender or receiver), sorted by newest first.

  ***Optional query parameter -***
  
  When the user wants to sort the transaction history, an optional query parameter is sent in the request called `order`.
  If user wants latest transactions first, which are by default sorted as `DESC`, but if he wants `ASC` then on a button click a request is made to `/api/transactions/:userId?order=asc` and vice versa.
  ```
    ?order=asc | desc
  ```

### -> GET `/api/balance/:userId`
  Fetches the current balance of a user.

---

## Database Schema

#### -> `users` table

| Column  | Type           |
|---------|----------------|
| id      | SERIAL(PK)     |
| name    | VARCHAR        |
| balance | NUMERIC(10,2)  |


#### -> `transactions` table

| Column       | Type           |
|--------------|----------------|
| id           | SERIAL(PK)     |
| sender_id    | INT            |
| receiver_id  | INT            |
| amount       | NUMERIC(10,2)  |
| status       | VARCHAR        |
| created_at   | TIMESTAMP      |








