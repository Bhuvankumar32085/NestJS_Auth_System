# 💰 Personal Expense Tracker System (NestJS)

A scalable and production-ready **Personal Expense Tracker Backend API** built with **NestJS**, **TypeORM**, and **PostgreSQL (NeonDB)** during my internship.

This project helps users manage their daily income and expenses with secure authentication, category management, transaction tracking, dashboard analytics, subscription-based premium features, and online payments.

---

# 🚀 Features

## 🔐 Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes using JWT Guard

---

## 👤 User

* Get Logged-in User Profile

---

## 📂 Category Management

Users can create their own categories for Income and Expense.

### Features

* Create Category
* Get Categories
* Update Category
* Delete Category

Examples:

* Salary (Income)
* Freelancing (Income)
* Food (Expense)
* Shopping (Expense)
* Travel (Expense)

---

## 💸 Transaction Management

Users can manage all their financial transactions.

### Features

* Create Transaction
* Get Transactions
* Update Transaction
* Delete Transaction

Each transaction includes:

* Title
* Amount
* Income / Expense
* Description
* Date
* Category

---

## 📊 Dashboard Analytics

Dashboard APIs provide financial reports using SQL Aggregation and TypeORM QueryBuilder.

### Dashboard Features

* Total Income
* Total Expense
* Current Balance
* Total Transactions
* Monthly Summary
* Daily Summary

---

# 💳 Subscription & Plans

Implemented a premium subscription system that controls access to advanced features.

### Features

* Purchase Subscription Plans
* Active / Pending / Expired / Cancelled Subscription Status
* Payment Status Tracking
* Subscription Validation
* Subscription Expiry Handling
* Subscription Guard for Premium APIs

---

# 💰 Razorpay Payment Integration

Integrated Razorpay Payment Gateway for subscription purchases.

### Features

* Create Razorpay Orders
* Verify Razorpay Payments
* Secure Payment Signature Verification
* Payment Success & Failure Handling
* Subscription Activation After Successful Payment

---

# 🔔 Razorpay Webhooks

Implemented Razorpay Webhook support.

### Features

* Webhook Signature Verification
* Automatic Subscription Activation
* Secure Raw Body Verification
* Event Handling

---

# 👨‍💼 Admin Module

Implemented an Admin module for managing subscriptions and monitoring platform activity.

### Features

* Subscription Statistics
* View All User Subscriptions
* Pagination
* Search by User / Email / Plan
* Filter by Subscription Status
* Filter by Payment Status
* Sorting Support

---

# 📄 CSV Export

Premium users with an active subscription can download their transaction reports.

### Features

* Protected using Subscription Guard
* Download Transactions as CSV
* Monthly Report Support
* Total Income Summary
* Total Expense Summary
* Net Savings Summary

---

# 🔒 Route Protection

Implemented multiple layers of authorization.

### Guards

* JWT Guard
* Admin Role Guard
* Subscription Guard

---

# 📚 What I Learned

During this project, I learned and implemented:

## ✅ NestJS Fundamentals

* Modules
* Controllers
* Services
* Dependency Injection
* Decorators
* Routing
* Guards
* Exception Handling
* Custom Guards

---

## ✅ REST APIs

Implemented REST APIs using:

* GET
* POST
* PATCH
* DELETE

---

## ✅ TypeORM

Learned relational database development using TypeORM.

Topics covered:

* Entities
* Repositories
* CRUD Operations
* One-to-Many Relationships
* Many-to-One Relationships
* UUID Primary Keys
* Enums
* QueryBuilder
* Aggregation Queries
* Pagination
* Search
* Filtering
* Sorting

---

## ✅ PostgreSQL (NeonDB)

Integrated PostgreSQL using NeonDB.

Implemented:

* Database Connection
* Entity Synchronization
* Relational Database Design
* CRUD Operations
* SQL Aggregation
* Advanced QueryBuilder

---

## ✅ Authentication & Security

Implemented secure authentication using:

* JWT
* bcrypt
* Route Guards
* Password Hashing
* Protected APIs
* Role-Based Authorization
* Subscription-Based Authorization

---

## ✅ Payment Gateway

Implemented complete payment flow using Razorpay.

Topics covered:

* Order Creation
* Payment Verification
* Webhook Integration
* Signature Verification
* Subscription Activation

---

## ✅ Validation

Used:

* DTO
* ValidationPipe
* class-validator
* class-transformer

---

## ✅ Dashboard Reports

Implemented SQL Aggregation using QueryBuilder.

Learned:

* SUM()
* COUNT()
* CASE
* GROUP BY
* ORDER BY
* EXTRACT(MONTH)
* EXTRACT(DAY)

---

## ✅ Error Handling

Implemented proper exception handling using NestJS Exceptions.

Examples:

* BadRequestException
* UnauthorizedException
* ForbiddenException
* NotFoundException
* ConflictException
* InternalServerErrorException

---

# 🛠️ Technologies Used

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* NeonDB
* JWT
* bcrypt
* Razorpay
* class-validator
* class-transformer
* json2csv
* Node.js

---

# 📂 API Modules

```text
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
├── Delete Transaction
└── Export CSV

Dashboard
│
├── Total Summary
├── Monthly Summary
└── Daily Summary

Plan
│
├── Create Plan
├── Get Plans
├── Update Plan
└── Delete Plan

Subscription
│
├── Purchase Subscription
├── Verify Payment
└── Razorpay Webhook

Admin
│
├── Subscription Statistics
└── Manage User Subscriptions
```

---

# 🎯 Project Outcome

This project helped me understand how production-ready backend applications are built using NestJS.

Through this project, I gained practical experience in:

* Backend Architecture
* Authentication & Authorization
* Role-Based Access Control
* Subscription-Based Features
* Payment Gateway Integration
* Webhook Handling
* Database Relationships
* REST API Development
* TypeORM
* PostgreSQL
* SQL Aggregation
* Advanced QueryBuilder
* Pagination
* Searching
* Filtering
* Sorting
* Dashboard Analytics
* CSV Report Generation
* Exception Handling
* Secure API Development

---

# ⭐ Skills Gained

* NestJS
* TypeScript
* REST API Development
* Backend Architecture
* TypeORM
* PostgreSQL
* NeonDB
* JWT Authentication
* Role-Based Authorization
* Subscription Management
* Razorpay Integration
* Webhook Handling
* DTO Validation
* QueryBuilder
* Pagination
* Search & Filter
* SQL Aggregation
* Dashboard Development
* CSV Export
* Exception Handling
* Dependency Injection

---

## 📌 Future Improvements

* Scheduled Subscription Expiry using Cron Jobs
* Email Notifications
* PDF Report Export
* Category-wise Analytics
* Expense Trend Reports
* Budget Management
* Swagger Documentation
* Docker Support
* Unit Testing
* Integration Testing

---

Thank you for visiting this repository! 🚀
