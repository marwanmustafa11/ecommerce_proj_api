# Project Description
This is a full-featured RESTful Ecommerce API built with Node.js, Express, and MongoDB.
 It covers the complete lifecycle of an online store — from user registration and product 
 management to cart, orders, payments, and an admin dashboard.   
 
# Technologies

    Technology	                Purpose

    Node.js	                    Server-side JavaScript runtime environment 
 

    Express.js	                Web framework — routing, middleware, error handling 
 

    MongoDB	                    NoSQL document database 
 

    Mongoose	                ODM — schemas, models, validation, hooks, methods 
 

    JWT	                        Stateless authentication tokens 
 

    bcryptjs	                Secure password hashing 
 

    Cloudinary	                Cloud-based image storage and delivery 
 

    Multer	                    Middleware for handling multipart/form-data (file uploads) 
 
    Nodemailer	                Email sending (OTP, order confirmations, status updates) 
 

    Slugify	                    Auto-generate URL-friendly slugs from product names 
 

    dotenv	                    Load environment variables from .env file 
 

    cors	                    Cross-Origin Resource Sharing middleware 
 

    cookie-parser	            Parse cookies for JWT refresh token handling 
 

    Joi	                        For make validation 

    Morgan	                    For manage all the requests 

    Features                    Build RESTful APIs from scratch using Node.js and Express   

Design and work with MongoDB schemas using Mongoose ODM   

Implement Authentication and Authorization with JWT and bcrypt   

Upload and manage images with Cloudinary   

Build a complete shopping cart system with coupons and stock management   

Integrate Stripe for online payments including webhooks   

Use Mongoose Transactions for atomic, multi-step database operations   

Send automated emails (order confirmation, OTP, status updates) via Nodemailer   

Build an Admin Dashboard with real statistics using MongoDB Aggregation Pipeline   

Apply proper error handling, input validation, and role-based access control   


# Installation
Clone the repository:

Bash
Install dependencies:

Bash
npm install
Environment Variables
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
How to Run
Development mode (with nodemon):

Bash
npm run dev
Production mode:

Bash
npm start
API Documentation
# Authentication (/api/v1/auth)

POST /auth/register/send-otp — Register a new user & send verification OTP   

POST /auth/verify-otp — Verify OTP and activate user account   

POST /auth/login — Login user and return signed JWT   

POST /auth/logout — Logout current user   

POST /auth/forgot-password/send-otp — Request password reset OTP   

POST /auth/forgot-password/verify-otp — Set new password using OTP   

GET /auth/me — Get authenticated user's profile   

# Users (/api/v1/users)

POST /users/add — Add a new user from admin panel 

GET /users/all — Get all users  

GET /users/:id — Return one user   

PATCH /users/:id — Update the user data   

DELETE /users/:id — Delete one user from admin panel   

# Products (/api/v1/products)
GET /products — Get all active products   

GET /products/search — Advanced search   

GET /products/:id — Get a single product by ID   

POST /products — Create a new product   

PUT /products/update/:id — Update a product   

DELETE /products/:id — Delete a product   

POST /products/:id/reviews — Add a review to a product   

DELETE /products/:id/reviews/:reviewId — Delete a review   

GET /products/:id/reviews — Get all reviews for a product   

# Cart (/api/v1/carts)
GET /carts — Get the cart   

POST /carts/items — Add an item to the cart   

PATCH /carts/items — Update the quantity of an item  

DELETE /carts/items/:productId — Remove an item from the cart   

POST /carts/coupon — Apply a discount coupon 

DELETE /carts/coupon — Remove the currently applied coupon   

DELETE /carts/clear — Clear all items and coupon   

# Orders (/api/v1/orders)
POST /orders — Create a new order   

GET /orders/my — Get authenticated user's orders   

GET /orders/my/:id — Get specific order details   

PATCH /orders/my/:id/cancel — Cancel an order   


GET /orders/admin/dashboard — Admin: get all orders and stats   

GET /admin/carts

GET /admin GET /admin/id

PATCH /orders/admin/:id/status — Admin: update order status   

# Wishlist (/api/v1/wishlists)

GET /wishlists/my — Get user's wishlist   

POST /wishlists/add/:productId — Add product to wishlist   

DELETE /wishlists/remove/:productId — Remove product from wishlist   

DELETE /wishlists/clear — Clear wishlist   




GET  /admin/dashboard    -  Full stats: revenue, order counts, top products, daily revenue (last 7 days)

GET /admin/carts   - View all active carts with user info and item details

GET /admin/wishlists  - View all user wishlists with pagination

GET /admin/wishlists/stats  -  Get the top 10 most wishlisted products

## Authentication
POST /api/v1/auth/register - Register a new user
POST /api/v1/auth/login - Login user and get token

## Admin Access
GET /api/v1/admin/users - Get all users (Admin only)
DELETE /api/v1/admin/users/:id - Delete a user (Admin only)


Project Structure
Plaintext
ecommerce-api/
├── config/
├── models/
│   ├── User.model.js
│   ├── Product.model.js
│   ├── Order.model.js
│   ├── Cart.model.js
│   ├── Wishlist.model.js
│   └── OTP.model.js
├── controllers/
├── db/
├── routes/
├── middleware/
├── utils/
├── validation/
├── index.js
├── .env
└── vercel.json


# Team Members

Marwan Mostafa Hamdy Mahmoud (Leader)

Mohamed Ahmed Mohamed Bastawisi

Samia Ashraf Shawky Shalaby

Rawan Sayed Abdelrahim Asran

Mohamed Ali Abdullah Mohamed

Rewan El Hassan Hamdy Abdelkader

Kholoud Fawzy Fawzy Omran

Mayada Abdelmageed El Sayed El Helou

Mostafa Samy Fathy Hassan

Hany Shaker Rizk Naseef