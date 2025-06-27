----------------------------------------------HOBBY-HUB-BACKEND----------------------------------------------



# This backend serves as the API for the HobbyHub platform, managing:

* Group creation and retrieval

* User-based group filtering

* Reviews and feedback system

* User authentication via Firebase

* Secure and scalable data access via MongoDB

It is built with Node.js, Express, and MongoDB, and integrates with Firebase Authentication for user management.




# Feature

# Group Management API

* Create, fetch, update, and delete groups

* Filter groups by user, category, etc.


 # User Reviews

* Post, edit, and delete reviews

* Store rating and comments

* Prevent duplicate reviews per user
 

# Authentication

* Firebase token-based auth verification

* Route protection for authorized endpoints


# CORS & Middleware

* Secure API access using CORS

* Express middleware for JSON parsing and logging


# Date-based Sorting

* Sort data by creation or submission date

* Support for newest/oldest view on frontend



# Tech Stack

* Node.js	JavaScript runtime
* Express.js	Server framework
* MongoDB + Mongoose	NoSQL database
* Firebase Admin SDK	Auth token verification
* Dotenv	Environment variable management
* Cors	Cross-origin request handling
* Morgan (optional)	HTTP request logging


# Live Link
1. https://hobbyhub-server-xi.vercel.app/allgroups

2. https://hobbyhub-server-xi.vercel.app/popular-hobbies

3.  https://hobbyhub-server-xi.vercel.app/reviews



