# GadgetFlow API

**GadgetFlow API** is a backend REST API developed using **Next.js** to support data management and backend operations for the **GadgetFlow - Smartphone Product & Order Management System**.

The API provides functionality for smartphone product management, category management, customer order processing, user authentication, and administrative operations through structured REST API endpoints.

## 📱 About the Project

GadgetFlow API was developed as the backend foundation and service layer for **GadgetFlow - Smartphone Product & Order Management System** using **Next.js** as the backend development framework.

The API manages core backend operations and application services related to smartphone retail, including smartphone product catalog management, product category organization, customer order processing, user authentication and authorization, administrative operations, database relationship management, and system activity tracking.

The API is designed to provide structured communication between frontend applications and backend services through RESTful API architecture using JSON based data exchange.

GadgetFlow API implements a professional backend architecture using separated layers for API Routes, Service Layer, Validation Layer, Middleware, and Database Layer to improve maintainability, scalability, and development efficiency.

The API also includes authentication and security mechanisms such as JWT based authentication, role based access control, password encryption, refresh token management, and password recovery workflows.

## ✨ Features

Key features and implementations include:

* Smartphone product management API
* Product category management
* Customer order management
* Order and order detail processing
* User registration and authentication
* JWT based authentication system
* Refresh token implementation
* Role based access control (USER & ADMIN)
* Protected API endpoints
* Password encryption using bcrypt
* Forgot password and reset password workflow
* Email notification system
* Product image upload handling
* API request validation using Zod
* Standardized API response format
* Centralized error handling
* Database relationship management using Prisma ORM
* Audit log activity tracking
* Pagination support
* Nested category product API
* Swagger OpenAPI documentation
* Frontend and backend data communication support

## 📱 Product Management

GadgetFlow API provides complete CRUD operations for smartphone products.

Supported operations:

* Create smartphone products
* Retrieve product lists
* Retrieve product details
* Update product information
* Delete products
* Upload product images
* Filter products by category
* Pagination support

Product information includes:

* Product name
* Price
* Description
* Product image
* Category information
* Product metadata

## 📂 Category Management

The API manages smartphone product categories with relational database support.

Features:

* Create categories
* Retrieve categories
* Update categories
* Delete categories
* Retrieve products based on category
* Nested category product relationships

## 🛒 Order Management

GadgetFlow API provides order processing functionality for customer transactions.

Order features include:

* Create customer orders
* Manage order items
* Connect orders with smartphone products
* Retrieve order details
* Track transaction relationships

The order system uses relational data structures between:

* Users
* Orders
* Order Details
* Products

## 🔐 Authentication & Authorization

The API implements a secure authentication system using JWT based authentication.

Security features:

* User registration
* Login authentication
* JWT access token
* Refresh token mechanism
* Protected API routes
* Role based access control
* Password hashing using bcrypt

Supported roles:

* USER
* ADMIN

Sensitive operations such as product management and administration are protected using authorization middleware.

## 📧 Email & Password Recovery

GadgetFlow API provides email based account recovery functionality.

Implemented features:

* Registration welcome email
* Forgot password request
* Password reset token generation
* Reset password validation
* Password update process

Email service is implemented using Nodemailer.

## 🗄️ Database Management

The API uses Prisma ORM for database interaction and relational data management.

Database features include:

* User management
* Product management
* Category relationships
* Order relationships
* Order detail management
* Refresh token storage
* Password reset token storage
* Audit activity logging

Database design follows relational database principles to ensure consistency and scalability.

## 📝 Validation & Error Handling

The API implements structured request validation and error management.

Features:

* Request validation using Zod
* Centralized error handling
* Standard API response format
* Consistent HTTP status handling
* Secure input processing

## 📊 Audit Log System

GadgetFlow API includes activity tracking through audit logs.

Tracked activities include:

* User activities
* Administrative actions
* Data modification records

Audit logging helps maintain system transparency and operational monitoring.

## 🛠️ Technologies

The main technologies and platforms used in this project are:

* Next.js
* JavaScript
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

## 📚 API Documentation

GadgetFlow API provides API documentation using Swagger OpenAPI.

Documentation includes:

* Authentication endpoints
* Product endpoints
* Category endpoints
* Order endpoints
* Profile endpoints
* Admin endpoints


Swagger allows developers to:

* Explore available endpoints
* Test API requests
* Understand request and response formats
* Integrate frontend applications efficiently


## 🎯 Project Objectives

This project was developed to:

* Build a structured backend API for smartphone product management
* Provide a centralized API service for product and order operations
* Implement secure authentication and authorization mechanisms
* Create reusable REST API services for frontend applications
* Apply professional backend development practices
* Implement database relationship management using Prisma ORM
* Provide documented and maintainable API endpoints
* Develop a scalable backend foundation for future e commerce features

## 📜 License

This project is maintained for portfolio, reference, and development purposes.

---

**GadgetFlow API — Backend REST API for Smartphone Product & Order Management System**
