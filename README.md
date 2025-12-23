# LenDenClub – Real-time Transaction & Audit Log System

Repository Link - https://github.com/Manthan-23/simple-fund-transfer-audit

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

- > Create a `.env` file in the backend directory using `.env.example` as reference and change the `DB_PASS` as per your PostgreSQL DB password.

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

### -> GET `/api/transactions/:userId?order=desc`
  Fetches transaction history for a user (sender or receiver), sorted by newest first.

  ***Optional query parameter -***
  
  When the user wants to sort the transaction history, an optional query parameter is sent in the request called `order`.
  If user wants latest transactions first, which are by default sorted as `DESC`, but if he wants `ASC` then on a button click a request is made to `/api/transactions/:userId?order=asc` and vice versa.
  ```
    ?order=asc | desc
  ```
  > Authentication is simulated by scoping transaction history APIs to a specific user ID. Since authentication mechanisms (JWT/session) are out of scope for
  this assignment, the backend ensures that only transactions related to the requested user are returned.

  Response(when order = desc):
  ```
  {
    "transactions": [
        {
            "id": 51,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "200.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T18:31:43.227Z"
        },
        {
            "id": 50,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "400.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T13:52:34.472Z"
        },
        {
            "id": 49,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "500.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T13:51:20.999Z"
        }
    ]
}
```

  Response(when order = asc):
  ```
  {
    "transactions": [
        {
            "id": 49,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "500.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T13:51:20.999Z"
        },
        {
            "id": 50,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "400.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T13:52:34.472Z"
        },
        {
            "id": 51,
            "sender_id": 1,
            "receiver_id": 2,
            "amount": "200.00",
            "status": "SUCCESS",
            "created_at": "2025-12-21T18:31:43.227Z"
        }
    ]
}
```

### -> GET `/api/balance/:userId`
  Fetches the current balance of a user.

  Response(updated balance after successful transaction):
  ```
  {"balance":"2900.00"}
  ```

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


---

## AI Tool Usage Log

### -> AI-Assisted Tasks

- First of all, I used AI to get a better idea of the assignment by doing some brainstorming with AI.

- Assisted AI for designing a PostgreSQL schema for users and transactions.

- Generated database transaction boilerplate for atomic `fund transfer logic`.

- Took AI help in React component structure for designing the transaction history table UI and sorting functionality.

- When I was testing fund transfer using different amounts like "100, 73, 200, 1000", it was failing for some amounts like "200, 73".
- > Then I explained this issue to AI to understand why its happening and how i can fix that. The issue was PostgreSQL returns amount to NodeJS as a string so when i was
  > comparing `senderBal < amount` it used to check first character of the amount value as it was `String`, so it was comparing ( 1000 < 73 ), as '1' < '7', it was generating insufficient balance error,
  > even though there was enough balance. The fix was to `parseFloat` the amount value.

- After the above issue, I tested various kinds of input in the `Amount field` like ( 'abcd', 'abcd10', '10abcd' ), to handle this kind of inputs I took some help from AI to genearate a `regex` which i can apply on the input field.
- Also, I got this later, that if `sender` enters his own ID as the `receiver_ID`, the transfer was getting successful, so I fixed this edge case later.

### -> Effectiveness Score

`Score: 4 / 5`

AI tools help a lot in brainstorming the project before starting on it, thus they help in getting a better idea of how to approach a project or its final solution in the right way.

AI tools significantly reduced development time for boilerplate code and
initial logic. Manual debugging and refinements were also required to ensure
correct transaction handling, data integrity and ACID compliance.

Additionally, AI tools facilitated the design of the frontend with ease, saving time and effort.

---

## Real-time Update Mechanism

- After a successful transfer:

- The frontend triggers a callback (onSuccess)

- User balance is re-fetched immediately

- Transaction history is re-fetched using a shared refresh key

- UI updates instantly without page reloads

