# GadgetFlow API

**GadgetFlow API** is a backend REST API developed using **Next.js** to support data management and backend operations for the **GadgetFlow - Smartphone Product & Order Management System**.

The API provides functionality for smartphone product management, category management, customer order processing, user authentication, authorization, audit tracking, and administrative operations through structured REST API endpoints.

---

## 📱 About the Project

GadgetFlow API was developed as the backend foundation and service layer for the **GadgetFlow - Smartphone Product & Order Management System** using **Next.js** as the backend framework.

The API manages core backend operations for smartphone retail systems, including product catalog management, category organization, customer order processing, user authentication, authorization management, database relationship handling, and system activity tracking.

The API is designed using a RESTful API architecture with JSON-based communication between frontend applications and backend services.

GadgetFlow API applies a professional backend architecture using separated layers:

- API Routes Layer
- Service Layer
- Validation Layer
- Middleware Layer
- Database Layer

This architecture improves maintainability, scalability, code organization, and development efficiency.

The API also implements security mechanisms including JWT authentication, role-based access control, password encryption, refresh token management, password recovery workflow, and audit logging.

---

# ✨ Features

Key features and implementations include:

* Smartphone product management API
* Product category management
* Customer order management
* Order and order detail processing
* User registration and authentication
* JWT based authentication system
* Access token generation
* Refresh token management
* Refresh token rotation mechanism
* HttpOnly cookie based refresh token storage
* Role based access control (USER & ADMIN)
* Protected API endpoints
* Password encryption using bcrypt
* Forgot password workflow
* Reset password workflow
* Email notification system
* Product image upload handling
* Request validation using Zod
* Standardized API response format
* Centralized error handling
* Prisma ORM database management
* MySQL relational database support
* Audit log activity tracking
* Pagination support
* Product search functionality
* Product price filtering
* Product price sorting
* Soft delete implementation
* Nested relational API response
* Swagger OpenAPI documentation

---

# 📱 Product Management

GadgetFlow API provides complete CRUD operations for smartphone products.

Supported operations:

* Create smartphone products
* Retrieve product lists
* Retrieve product details
* Update product information
* Soft delete products
* Upload product images
* Search products by name
* Filter products based on price range
* Sort products by price
* Pagination support

Product information includes:

* Product name
* Product price
* Product image
* Category information
* Product metadata
* Deleted timestamp tracking

The product deletion system uses **soft delete implementation** through `deletedAt` timestamp, allowing deleted records to remain available for database consistency and future management purposes.

---

# 📂 Category Management

The API manages smartphone product categories with relational database support.

Features:

* Create categories
* Retrieve categories
* Retrieve category details
* Update categories
* Delete categories
* Retrieve products based on category relationships

Category deletion includes validation protection to prevent deletion when the category is still associated with existing products.

---

# 🛒 Order Management

GadgetFlow API provides order processing functionality for customer transactions.

Order features include:

* Create customer orders
* Manage order items
* Connect orders with smartphone products
* Retrieve order details
* Delete orders
* Maintain transaction relationships

The order system uses relational database structures between:

* Orders
* Order Items
* Products

Order creation uses Prisma database transaction handling to maintain data consistency during multi-step operations.

---

# 🔐 Authentication & Authorization

The API implements a secure authentication system using JWT-based authentication.

Security features:

* User registration
* Login authentication
* JWT access token generation
* Refresh token generation
* Refresh token rotation
* HttpOnly cookie refresh token storage
* Protected API routes
* Role based authorization middleware
* Password hashing using bcrypt
* Session revocation during password reset

Supported roles:

* USER
* ADMIN

Administrative operations are protected using authorization middleware.

Examples of protected operations:

* Product management
* Category management
* Order management

---

# 📧 Email & Password Recovery

GadgetFlow API provides email-based account recovery functionality.

Implemented features:

* Registration welcome email
* Forgot password request
* Password reset token generation
* Token expiration validation
* Password reset validation
* Password update process
* Reset token deletion after successful usage

Email functionality is implemented using **Nodemailer**.

Password reset tokens are securely managed with expiration handling to prevent reuse of expired tokens.

---

# 🗄️ Database Management

The API uses **Prisma ORM** for database interaction and relational data management.

Database entities include:

* User
* Product
* Category
* Order
* Order Item
* Refresh Token
* Password Reset Token
* Audit Log

Database features:

* User management
* Product catalog management
* Category relationships
* Order relationships
* Refresh token storage
* Password reset token storage
* User activity tracking

The database design follows relational database principles to maintain data consistency and scalability.

---

# 📝 Validation & Error Handling

The API implements structured request validation and centralized error handling.

Features:

* Request validation using Zod
* Authentication validation
* Input sanitization
* Centralized API error handling
* Standard API response format
* Consistent HTTP status handling

Validation schemas include:

* User registration validation
* User login validation
* Product validation
* Category validation
* Order validation

---

# 📊 Audit Log System

GadgetFlow API includes activity tracking through audit logs.

Tracked activities include:

* User registration
* Login activity
* Logout activity
* Refresh token rotation
* Password reset activity
* Product creation
* Product update
* Product deletion
* Category modification
* Order creation
* Order deletion

Audit logs store:

* User information
* Action type
* Entity information
* Entity ID
* Previous data
* New data
* IP address
* User agent

The audit system helps maintain transparency and operational monitoring.

---

# 🏗️ Backend Architecture

GadgetFlow API applies a layered backend architecture:

API Routes
|
↓
Service Layer
|
↓
Validation Layer
|
↓
Middleware Layer
|
↓
Prisma ORM
|
↓
MySQL Database

Responsibilities:

**API Routes**
- Handle HTTP requests
- Manage API responses
- Connect frontend communication

**Service Layer**
- Handle business logic
- Manage database operations

**Validation Layer**
- Validate incoming request data

**Middleware Layer**
- Handle authentication and authorization

**Database Layer**
- Manage relational data using Prisma ORM

---

# 🛡️ API Security

Implemented security mechanisms:

* JWT based authentication
* Role based access control
* Password hashing with bcrypt
* Secure refresh token storage
* HttpOnly cookies
* Refresh token rotation
* Token expiration handling
* Protected administrative endpoints
* Centralized error management

---

# 🛠️ Technologies

The main technologies and platforms used in this project are:

* Next.js
* TypeScript
* Node.js
* Prisma ORM
* MySQL
* JWT
* bcrypt
* Zod
* Nodemailer
* REST API
* JSON
* Swagger OpenAPI
* Vercel

---

# 📚 API Documentation

GadgetFlow API provides API documentation using Swagger OpenAPI.

Documentation includes:

* Authentication endpoints
* Product endpoints
* Category endpoints
* Order endpoints

Swagger allows developers to:

* Explore available endpoints
* Test API requests
* Understand request and response formats
* Integrate frontend applications efficiently

---

# 🎯 Project Objectives

This project was developed to:

* Build a structured backend API for smartphone product management
* Provide centralized backend services for product and order operations
* Implement secure authentication and authorization mechanisms
* Apply professional backend architecture practices
* Implement relational database management using Prisma ORM
* Develop reusable REST API services
* Provide documented API endpoints using Swagger
* Create a scalable backend foundation for future e-commerce features

---

# 📜 License

This project is maintained for portfolio, reference, and development purposes.

---

**GadgetFlow API — Backend REST API for Smartphone Product & Order Management System**

```
