# 💰 Personal Expense Tracker System (NestJS)

A scalable and production-ready **Personal Expense Tracker Backend API** built with **NestJS**, **TypeORM**, and **PostgreSQL (NeonDB)** during my internship.

This project helps users manage their daily income and expenses with secure authentication, category management, transaction tracking, and dashboard analytics.

---

# 🚀 Features

## 🔐 Authentication

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes using JWT Guard

---

## 👤 User

- Get Logged-in User Profile

---

## 📂 Category Management

Users can create their own categories for Income and Expense.

### Features

- Create Category
- Get Categories
- Update Category
- Delete Category

Examples:

- Salary (Income)
- Freelancing (Income)
- Food (Expense)
- Shopping (Expense)
- Travel (Expense)

---

## 💸 Transaction Management

Users can manage all their financial transactions.

### Features

- Create Transaction
- Get Transactions
- Update Transaction
- Delete Transaction

Each transaction includes:

- Title
- Amount
- Income / Expense
- Description
- Date
- Category

---

## 📊 Dashboard Analytics

Dashboard APIs provide financial reports using SQL Aggregation and TypeORM QueryBuilder.

### Dashboard Features

- Total Income
- Total Expense
- Current Balance
- Total Transactions
- Monthly Summary
- Daily Summary

---

# 📚 What I Learned

During this project, I learned and implemented:

## ✅ NestJS Fundamentals

- Modules
- Controllers
- Services
- Dependency Injection
- Decorators
- Routing
- Guards
- Exception Handling

---

## ✅ REST APIs

Implemented REST APIs using:

- GET
- POST
- PATCH
- DELETE

---

## ✅ TypeORM

Learned relational database development using TypeORM.

Topics covered:

- Entities
- Repositories
- CRUD Operations
- One-to-Many Relationships
- Many-to-One Relationships
- UUID Primary Keys
- Enums
- QueryBuilder
- Aggregation Queries

---

## ✅ PostgreSQL (NeonDB)

Integrated PostgreSQL using NeonDB.

Implemented:

- Database Connection
- Entity Synchronization
- Relational Database Design
- CRUD Operations

---

## ✅ Authentication & Security

Implemented secure authentication using:

- JWT
- bcrypt
- Route Guards
- Password Hashing
- Protected APIs

---

## ✅ Validation

Used:

- DTO
- ValidationPipe
- class-validator
- class-transformer

---

## ✅ Dashboard Reports

Implemented SQL Aggregation using QueryBuilder.

Learned:

- SUM()
- COUNT()
- CASE
- GROUP BY
- ORDER BY
- EXTRACT(MONTH)
- EXTRACT(DAY)

---

## ✅ Error Handling

Implemented proper exception handling using NestJS Exceptions.

Examples:

- BadRequestException
- UnauthorizedException
- NotFoundException
- ConflictException
- InternalServerErrorException

---

# 🛠️ Technologies Used

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- NeonDB
- JWT
- bcrypt
- class-validator
- class-transformer
- Node.js

---

# 📂 API Modules

```
Auth
│
├── Signup
└── Login

User
│
└── Get Profile

Category
│
├── Create Category
├── Get Categories
├── Update Category
└── Delete Category

Transaction
│
├── Create Transaction
├── Get Transactions
├── Update Transaction
└── Delete Transaction

Dashboard
│
├── Total Summary
├── Monthly Summary
└── Daily Summary
```

---

# 🎯 Project Outcome

This project helped me understand how production-ready backend applications are built using NestJS.

Through this project, I gained practical experience in:

- Backend Architecture
- Authentication
- Database Relationships
- REST API Development
- TypeORM
- SQL Aggregation
- QueryBuilder
- Dashboard Analytics
- Exception Handling
- Secure API Development

---

# ⭐ Skills Gained

- NestJS
- TypeScript
- REST API Development
- Backend Architecture
- TypeORM
- PostgreSQL
- NeonDB
- JWT Authentication
- Password Hashing
- DTO Validation
- QueryBuilder
- SQL Aggregation
- Dashboard Development
- Exception Handling
- Dependency Injection

---

## 📌 Future Improvements

- Pagination
- Transaction Filters
- Category-wise Analytics
- Recent Transactions API
- Expense Trend Reports
- Swagger Documentation
- Docker Support
- Unit Testing

---

Thank you for visiting this repository! 🚀
